import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const run = (command, args) => execFileSync(command, args, { cwd: root, encoding: 'utf8', windowsHide: true }).trim();
const baseUrl = process.env.EVIDENCE_BASE_URL || 'http://localhost:3000';
const get = (url) => fetch(url, { signal: AbortSignal.timeout(15000) });
const rootResponse = await get(baseUrl);
assert.equal(rootResponse.status, 200);
const listResponse = await get(`${baseUrl}/reports`);
assert.equal(listResponse.status, 200);
const reports = await listResponse.json();
assert(Array.isArray(reports));
assert(reports.every((report) => 'photoUrl' in report && 'repairPhotoUrl' in report));
const form = new FormData();
for (const [key, value] of Object.entries({ title: 'Validacion sin foto', location: 'Calle de prueba', description: 'Esta solicitud debe rechazarse.' })) form.append(key, value);
const missingPhoto = await fetch(`${baseUrl}/reports`, { method: 'POST', body: form, signal: AbortSignal.timeout(15000) });
assert.equal(missingPhoto.status, 400);
const photoReport = reports.find((report) => report.photoUrl);
const publicPhoto = { status: null, verified: false, error: null };
if (photoReport) {
  try {
    const response = await get(photoReport.photoUrl);
    publicPhoto.status = response.status;
    await response.arrayBuffer();
    publicPhoto.verified = response.status === 200;
  } catch (error) {
    publicPhoto.error = error.cause?.code || error.message;
  }
}
const trackedEnv = run('git', ['ls-files', '--', '.env']);
assert.equal(trackedEnv, '');
assert.equal(run('git', ['check-ignore', '.env']), '.env');
const imageCheckCode = `const fs=require('fs');const names=['.env','compose.yaml','compose.yml','docker-compose.yml','.git'];const found=names.filter(n=>fs.existsSync('/app/'+n));if(found.length)process.exit(1);console.log(JSON.stringify({forbiddenFilesFound:found,uid:process.getuid()}));`;
const imageFiles = JSON.parse(run('docker', ['run', '--rm', '--entrypoint', 'node', 'roapadilla/aquafix-api:latest', '-e', imageCheckCode]));
const embeddedEnv = JSON.parse(run('docker', ['image', 'inspect', '--format', '{{json .Config.Env}}', 'roapadilla/aquafix-api:latest']));
const credentialKeys = embeddedEnv.map((item) => item.split('=')[0]).filter((key) => /^(AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|MAIL_PASS|DB_PASSWORD|DOCKER_PASSWORD)$/.test(key));
assert.equal(credentialKeys.length, 0);
const composeStatus = run('docker', ['compose', 'ps', '-a', '--format', 'json'])
  .split(/\r?\n/).filter(Boolean).flatMap((line) => JSON.parse(line))
  .map((item) => ({ service: item.Service, name: item.Name, image: item.Image, state: item.State, status: item.Status, health: item.Health, exitCode: item.ExitCode, ports: item.Ports }));
const evidence = {
  generatedAtUtc: new Date().toISOString(),
  generatedAtMexicoCity: new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
  scope: 'Validacion local real. No acredita por si sola publicacion en GitHub Actions, Docker Hub ni recepcion del correo.',
  baseUrl,
  git: { head: run('git', ['rev-parse', 'HEAD']), branch: run('git', ['branch', '--show-current']), pendingChanges: Boolean(run('git', ['status', '--porcelain'])), envTracked: false, envIgnored: true },
  checks: { health: rootResponse.status, getReports: listResponse.status, reportCount: reports.length, bothPhotoFieldsPresent: true, missingPhoto: missingPhoto.status, publicPhoto },
  pendingChecks: publicPhoto.verified ? [] : ['Confirmar acceso publico a S3 desde una conexion con resolucion DNS disponible.'],
  sample: photoReport ? { reportId: photoReport.id, photoUrl: photoReport.photoUrl } : null,
  docker: { image: 'roapadilla/aquafix-api:latest', imageId: run('docker', ['image', 'inspect', '--format', '{{.Id}}', 'roapadilla/aquafix-api:latest']), ...imageFiles, embeddedCredentialKeys: credentialKeys, composeStatus },
};
const output = new URL('../evidencias/validacion-local.json', import.meta.url);
mkdirSync(new URL('../evidencias/', import.meta.url), { recursive: true });
writeFileSync(output, `${JSON.stringify(evidence, null, 2)}\n`);
console.log(`Validacion real guardada en ${fileURLToPath(output)}. No se creo ningun reporte ni se envio correo.`);
