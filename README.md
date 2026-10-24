# AguaFix API

API NestJS de reportes de fugas con PostgreSQL, fotos en Amazon S3 y alertas por correo.

## Entregables

- Git: https://github.com/Roapapu/water-api
- Docker Hub: https://hub.docker.com/r/roapadilla/aquafix-api
- Imagen: `roapadilla/aquafix-api:latest`

## Configuración local

Conserva tu `.env` existente. Para una instalación nueva copia `.env.example` a `.env` y completa sus valores.
No subas `.env` a Git. Las credenciales se inyectan al ejecutar el contenedor y no se usan para construir la imagen.

```powershell
npm ci
npm run migration:run
npm run start:dev
```

Se mantiene `synchronize: false`. La nueva migración añade `photoUrl`, `repairPhotoUrl` y `phone` como columnas nullable para conservar reportes anteriores. El POST exige foto para todos los reportes nuevos. `repairPhotoUrl` queda en null hasta que exista un flujo de reparación; esta entrega no agrega un endpoint de reparación.

## S3

- Región: `us-east-1`.
- Bucket: `aqua-fix-reports-roa-2026`.
- Prefijo: `reports/`.
- Variables: `AWS_REGION`, `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`.
- El usuario de la API necesita `s3:PutObject` sobre `arn:aws:s3:::aqua-fix-reports-roa-2026/reports/*`.
- La política del bucket concede `s3:GetObject` público únicamente sobre ese prefijo.
- Mantén ACL deshabilitadas. La API no envía ACL en la subida.

## Probar con Bruno

Abre la colección con **Open Collection** y selecciona la carpeta `bruno` de este repositorio. Elige el entorno **Local**. Las solicitudes ya tienen los campos y pruebas preparados; selecciona una foto real en el campo `photo` de la solicitud 02.

Usa el puerto de `PORT` en tu `.env`. En POST `/reports`, elige Body → Multipart Form:

| Campo | Tipo | Ejemplo |
| --- | --- | --- |
| title | Text | Fuga en vía pública |
| location | Text | Calle 10, esquina con avenida Central |
| description | Text | Sale agua de una tubería junto a la banqueta |
| severity | Text | HIGH |
| phone | Text | 5551234567 |
| photo | File | Selecciona una foto JPEG, PNG o WebP |

No agregues manualmente el encabezado Content-Type: Bruno genera el boundary multipart.
La foto es obligatoria y tiene un límite de 5 MB. Severity es opcional, con valor predeterminado MEDIUM; phone es opcional para conservar compatibilidad con los campos del primer parcial.

- POST exitoso: 201, reporte con `photoUrl`.
- POST sin foto: 400.
- Archivo que no es una imagen permitida: 400.
- Foto mayor al límite: 413 (límite del interceptor).
- GET `/reports`: incluye `photoUrl` y `repairPhotoUrl`.
- El correo incluye ubicación, descripción, severidad, teléfono e imagen de S3 con `<img>`.

El envío de correo mantiene el comportamiento previo: si SMTP falla, el reporte permanece guardado. Revisa el correo recibido para validar la entrega; una respuesta 201 por sí sola no confirma recepción del correo.

## Docker Compose

El compose usa la imagen publicada en Docker Hub, conserva el volumen `postgres_data` y mantiene el servicio `db` y el contenedor `water_reports_db` de la versión anterior. Ejecuta los comandos desde la misma carpeta y con el mismo nombre de proyecto de Compose para conservar el volumen existente.

```powershell
docker compose pull
docker compose up -d
docker compose ps -a
docker compose logs migrate
docker compose logs api
```

El servicio `migrate` aplica las migraciones compiladas después de que PostgreSQL esté listo. La API inicia cuando la migración termina correctamente. Dentro de Docker, DB_HOST y DB_PORT se ajustan a `db:5432`; tu `.env` local puede conservar localhost y el puerto 5433.
No ejecutes `docker compose down -v`: elimina los datos del volumen.

Para construir y probar localmente antes de publicar:

```powershell
docker build -t roapadilla/aquafix-api:latest .
docker compose up -d --pull never
```

El Dockerfile usa node:22-alpine en ambas etapas y ejecuta `node dist/main` como usuario node. `.dockerignore` excluye `.env`, variantes de entorno, los archivos compose, node_modules, dist y .git. La imagen final solo recibe package.json, dependencias de producción y dist.

## GitHub Actions

En Settings → Secrets and variables → Actions → Repository secrets:

- `DOCKER_USER`: usuario de Docker Hub.
- `DOCKER_PASSWORD`: token de Docker Hub con lectura y escritura.

Cada push a main activa `.github/workflows/docker-publish.yml`, que inicia sesión, construye y publica `roapadilla/aquafix-api:latest`. No necesita las claves de AWS, SMTP ni base de datos para construir.

## Validación

```powershell
npm run build
npm run lint
npm test -- test/reports.spec.ts src/storage/storage.service.spec.ts
```

Las pruebas de fotos usan dobles de S3, base de datos y correo. Para la entrega también valida el flujo con los servicios reales.
Los tests existentes de AuthController y AuthService no declaran sus dependencias en el módulo de pruebas y fallaban antes de esta integración.

## Guion del video (orden obligatorio)

1. Inicia la grabación, muestra un cambio de código y revisa el diff. No muestres .env ni tokens.
2. Haz commit y push a main de los archivos de la implementación. Revisa `git status` antes de agregar archivos y confirma que .env no esté incluido.
3. Abre GitHub → Actions y muestra el workflow ejecutándose hasta quedar verde.
4. Abre Docker Hub → roapadilla/aquafix-api → Tags y muestra latest con su fecha de actualización.
5. Ejecuta `docker compose pull` y `docker compose up -d`; comprueba que la API y PostgreSQL estén activos y migrate haya terminado con código 0.
6. En Bruno crea un reporte con foto y muestra la respuesta con photoUrl.
7. Abre S3 → bucket → reports/ y muestra el nuevo objeto. Comprueba su URL en incógnito.
8. Abre el correo recibido y muestra la foto visible. Si tu cliente bloquea imágenes remotas, permite mostrarlas.
9. Puedes mostrar GET /reports y un POST sin foto que responda 400 como evidencia adicional.

Consulta [el guion detallado de grabación](evidencias/GUIA-DE-GRABACION.md) y [el formato de entrega](evidencias/ENTREGA.md).
