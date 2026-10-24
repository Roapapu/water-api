# Guía de grabación y entrega con Bruno

Duración orientativa: 6 a 10 minutos, más el tiempo de construcción de GitHub Actions. Conserva el orden obligatorio. Puedes acelerar la espera del workflow, pero muestra primero que está ejecutándose y después que terminó correctamente.

## 0. Preparar antes de grabar

1. Abre la carpeta del proyecto en tu editor y una terminal PowerShell en `C:\Users\Roa\water-reports-api`.
2. Ten abiertos estos enlaces:
   - Actions: https://github.com/Roapapu/water-api/actions
   - Tags de Docker Hub: https://hub.docker.com/r/roapadilla/aquafix-api/tags
   - Bucket: https://s3.console.aws.amazon.com/s3/buckets/aqua-fix-reports-roa-2026?region=us-east-1&tab=objects
   - El correo destinatario que configuraste en MAIL_TO. No muestres el archivo .env.
3. Abre Bruno. Usa **Open Collection** y selecciona exactamente `C:\Users\Roa\water-reports-api\bruno`, donde está `bruno.json`. Selecciona **Local** como entorno.
4. Abre la solicitud **02 Crear reporte con foto**. En **Body > Multipart Form** comprueba que photo sea de tipo **File** y selecciona una foto JPEG, PNG o WebP real, menor a 5 MB. Puedes elegir la que ya subiste de prueba. No envíes todavía el reporte que usarás en el video.
   La carpeta local `bruno/fotos/fuga.jpeg` ya contiene tu imagen de prueba descargada del bucket, que muestra un pizarrón. Úsala solo para ensayar; para el video selecciona una foto de una fuga. La imagen local no se subirá a Git.
5. No agregues manualmente Content-Type ni Content-Length. Bruno debe calcularlos con el boundary multipart.
6. Usa un título identificable, por ejemplo `Evidencia AguaFix - fuga en Calle Central`. El teléfono de ejemplo es ficticio.
7. Cierra pestañas que muestren claves AWS, tokens Docker o el contenido de .env. La pantalla de nombres de Secrets es suficiente; no hace falta abrir sus valores.
8. Configura tu grabador para capturar el editor, terminal, navegador y Bruno, y prueba el micrófono. Usa la herramienta de grabación de pantalla que ya tengas. Este paquete no incluye un video grabado.
9. Verifica que Docker Desktop esté iniciado. La API local puede estar corriendo; al llegar al paso 4 la actualizarás con la imagen publicada.
10. En esta conexión S3 solo abrió al activar la VPN. Mantén la VPN activa para toda la computadora, no solo para el navegador, y comprueba el POST con foto en Bruno antes de grabar. Una VPN de navegador no necesariamente cubre el tráfico de la API en Docker.

La rúbrica dice Postman. Este guion usa Bruno por tu preferencia. Si tu profesor exige Postman de forma literal, confirma que acepta Bruno o repite la solicitud con esos mismos campos en Postman.

## 1. Mostrar un cambio real de código, commit y push

Inicia la grabación antes de editar.

### Qué mostrar

Abre `src/reports/templates/report.template.ts`. Localiza el atributo:

```html
alt="Foto de la fuga reportada"
```

Cámbialo por:

```html
alt="Evidencia fotografica de la fuga"
```

Guarda. Este cambio mejora el texto alternativo de la foto y permite que se vea la edición en el video. La implementación de S3, Docker y CI ya está pendiente en tu árbol de trabajo y se incluirá en el mismo commit.

### Qué decir

> Esta es la API AguaFix del primer parcial. Agregué una foto obligatoria a los reportes, almacenamiento en S3 y publicación automática de la imagen Docker. Estoy realizando un cambio visible en la plantilla del correo; ahora guardaré la implementación y la enviaré a main para activar el workflow.

### Comandos

```powershell
Set-Location C:\Users\Roa\water-reports-api
git branch --show-current
git status --short
git diff -- src/reports/templates/report.template.ts
git check-ignore .env
git ls-files .env
```

Debe verse `main`. `git check-ignore .env` debe imprimir `.env`; `git ls-files .env` no debe imprimir nada.

Agrega los archivos de la entrega y verifica los nombres antes del commit:

```powershell
git add -- .gitignore .dockerignore .env.example .github Dockerfile compose.yaml docker-compose.yml package.json package-lock.json tsconfig.json README.md src bruno scripts evidencias test/reports.spec.ts
git diff --cached --name-only
git diff --cached --name-only | Select-String '^\.env$'
git commit -m "feat: add report photos with S3 and Docker publishing"
git push origin main
git log -1 --oneline
```

`.env.example` es una plantilla sin claves y sí puede aparecer. `.env` no debe estar entre los archivos agregados. No uses force push si Git rechaza el envío: conserva el error para revisarlo.

### Captura opcional 01

Terminal mostrando el commit y el push a main completados. Debe verse el identificador del commit.

## 2. Mostrar GitHub Actions ejecutándose y en verde

### Qué mostrar

Abre https://github.com/Roapapu/water-api/actions y actualiza. Entra a **Publish AguaFix Docker image** correspondiente al commit que acabas de subir. Muestra primero el estado en ejecución y el job publish.

Abre los pasos Login to Docker Hub y Build and push. Espera hasta que el workflow termine en verde. Comprueba que el commit de esta ejecución coincide con el que mostraste en la terminal.

### Qué decir

> El push a main activó este workflow. GitHub Actions obtiene el usuario y el token desde DOCKER_USER y DOCKER_PASSWORD, construye el Dockerfile y publica roapadilla/aquafix-api con el tag latest.

### Resultado requerido

Job publish en verde, incluidos Login to Docker Hub y Build and push. Si está rojo, no avances dando la publicación por exitosa: abre el paso fallido y revisa su mensaje.

### Captura opcional 02

Vista del workflow exitoso con nombre, commit y pasos visibles.

## 3. Mostrar la imagen actualizada en Docker Hub

### Qué mostrar

Abre https://hub.docker.com/r/roapadilla/aquafix-api/tags, actualiza y localiza **latest**. Muestra la fecha o indicación Last pushed/Last updated y, si aparece, el digest.

### Qué decir

> Aquí está la imagen publicada automáticamente por el workflow. El tag latest muestra la actualización de esta ejecución. Este es también el enlace de Docker Hub que entregaré.

### Captura opcional 03

Repositorio roapadilla/aquafix-api, tag latest y fecha de publicación. La fecha debe corresponder al push reciente.

## 4. Levantar la imagen publicada junto con PostgreSQL

Vuelve a la terminal del proyecto:

```powershell
docker compose pull api migrate
docker compose up -d
docker compose ps -a
docker compose logs migrate
```

### Resultado esperado

- db: healthy.
- migrate: Exited (0); puede decir No migrations are pending si ya se habían aplicado localmente.
- api: Up y puerto 3000 publicado.

### Qué decir

> Compose usa la imagen de Docker Hub y PostgreSQL. Primero espera a la base de datos, ejecuta las migraciones y después inicia la API. Se mantiene synchronize en false y se conserva el volumen de datos.

No ejecutes down -v. El contenedor de migraciones con estado Exited (0) terminó correctamente; no debe mantenerse corriendo.

## 5. Crear el reporte con foto desde Bruno

### Solicitud exacta

Abre **02 Crear reporte con foto**, con entorno Local:

- Método: POST.
- URL: `http://localhost:3000/reports`.
- Body: Multipart Form.

| Campo | Tipo | Valor de ejemplo |
| --- | --- | --- |
| title | Text | Evidencia AguaFix - fuga en Calle Central |
| location | Text | Calle Central 123, esquina con avenida Norte |
| description | Text | Se observa una fuga de agua junto a la banqueta y acumulacion en la calle. |
| severity | Text | HIGH |
| phone | Text | 5551234567 |
| photo | File | Tu foto real de la fuga |

Muestra el campo photo con el archivo seleccionado. Pulsa **Send** una vez. Cada envío crea un reporte y manda un correo.

### Qué decir

> Envío los campos del reporte y el archivo photo como multipart. La API sube la foto a reports/ en S3, guarda su URL en PostgreSQL y envía la alerta a la cuadrilla.

### Resultado requerido

Respuesta **201 Created**, con id, campos del reporte, photoUrl y repairPhotoUrl. En un reporte nuevo repairPhotoUrl será null porque todavía no hay foto de reparación. Abre Tests para mostrar las comprobaciones de estado, URL del bucket y teléfono si tu versión de Bruno las ejecuta.

Copia **la photoUrl que devuelve este reporte**, no la URL vieja de prueba.jpeg ni la foto mínima de la validación técnica. Conserva también el id.

### Captura opcional 04

Bruno mostrando método, URL, campos multipart, archivo photo y respuesta 201 con photoUrl. Puedes ampliar el área de respuesta para que no quede cortada.

## 6. Mostrar el objeto de ese reporte en S3

Abre el bucket `aqua-fix-reports-roa-2026`, entra a **reports/** y actualiza la lista. El nombre del objeto es el último segmento de photoUrl. Busca ese nombre exacto y abre sus propiedades.

Abre la photoUrl en incógnito. Debe verse la misma foto que seleccionaste en Bruno.

### Qué decir

> Este objeto corresponde a la URL del reporte que acabo de crear. Está en la carpeta reports/ del bucket, y su lectura pública permite mostrar la imagen dentro del correo.

### Captura opcional 05

Objeto seleccionado en S3 con su nombre y ruta. Si necesitas otra captura, agrega la foto abierta desde la URL pública.

## 7. Mostrar el correo recibido con la imagen visible

Abre el correo destinatario y actualiza la bandeja. Busca el asunto **Alerta de Fuga: Evidencia AguaFix - fuga en Calle Central**, o el título que elegiste.

Abre el mensaje y muestra ubicación, descripción, severidad, teléfono y foto. Si el cliente bloquea contenido remoto, permite mostrar imágenes. La foto y el título deben coincidir con Bruno y S3.

### Qué decir

> Esta es la alerta generada al crear el reporte. La plantilla muestra los datos de contacto, la ubicación y la imagen mediante una etiqueta img con la URL pública de S3.

### Captura opcional 06

Mensaje abierto con título y foto visible. Un log SMTP de enviado no sustituye esta evidencia de recepción.

## 8. Comprobaciones adicionales recomendadas

Después del correo, regresa a Bruno:

1. Envía **03 Listar reportes**. Muestra **200 OK**, el nuevo reporte con su photoUrl y repairPhotoUrl, y que siguen apareciendo los reportes anteriores.
2. Envía **04 Rechazar reporte sin foto**. Muestra que no incluye el campo photo y que responde **400 Bad Request**.
3. Opcional: muestra StorageService.uploadFile, la nueva migración, synchronize: false, Dockerfile y .dockerignore desde el editor. No abras .env.

### Qué decir

> El listado incluye las dos URLs y conserva los reportes previos. Al omitir la foto, la API responde 400 y no crea el reporte.

### Capturas opcionales 07 y 08

GET con ambas URLs y POST sin foto rechazado.

## 9. Comprobar la exclusión de archivos en la imagen

Puedes generar evidencia local con:

```powershell
node scripts/generate-evidence.mjs
```

El resultado se guarda en `evidencias/validacion-local.json`. Verifica HTTP, URL pública, Git y archivos prohibidos de la imagen. No crea reportes ni envía correos. Debe ejecutarse desde el proyecto, con Docker y la API activos.

El archivo es un complemento verificable; no reemplaza las pantallas de Actions, Docker Hub ni el correo recibido.

También se incluyen `bruno-validacion.html` y `bruno-validacion.json`, generados con Bruno CLI contra la API local. Cubren las cuatro solicitudes, incluido el POST con imagen de ensayo: cuatro consultas y siete tests aprobados. Para el video repite el POST con una foto de una fuga y muestra el objeto y correo correspondientes a ese nuevo envío.

Si `validacion-local.json` indica `checks.publicPhoto.verified: false`, lee `error` y `pendingChecks`: no se debe presentar esa parte como aprobada. Durante la preparación se detectó un fallo de resolución DNS para S3 que se resolvió al activar la VPN del equipo. La última comprobación con VPN respondió 200; mantén la conexión durante la grabación.

## 10. Entregar

1. Detén la grabación y reproduce el video completo. Verifica que se lean URLs, estados HTTP y pasos del workflow, y que la foto sea visible en el correo.
2. Guarda el video como `AguaFix-S3-Docker-CI.mp4`. No lo agregues a Git; la carpeta evidencias ignora los formatos de video habituales.
3. Súbelo al medio que permita tu profesor. Si usas un enlace, comprueba sus permisos de visualización desde otra sesión.
4. Abre `evidencias/ENTREGA.md`, completa nombre, materia/grupo, fecha y enlace del video. Los enlaces de Git y Docker Hub ya están escritos.
5. Envía los tres enlaces por la plataforma escolar. Las capturas y la validación JSON son complementos; la consigna requiere el video.

Texto breve para la plataforma:

> Entrego AguaFix con recepción obligatoria de fotos, almacenamiento en Amazon S3, correo con imagen y publicación automática en Docker Hub mediante GitHub Actions.
>
> Repositorio: https://github.com/Roapapu/water-api
>
> Imagen Docker Hub: https://hub.docker.com/r/roapadilla/aquafix-api
>
> Video: PEGAR ENLACE DEL VIDEO
>
> Las pruebas HTTP del video se realizaron en Bruno.

## Errores comunes

| Problema | Qué revisar |
| --- | --- |
| No aparece el workflow | El push debe ser a main e incluir .github/workflows/docker-publish.yml |
| Login to Docker Hub falla | Secrets de repositorio DOCKER_USER y DOCKER_PASSWORD; token con permiso de escritura |
| Docker Hub no tiene latest | Espera a que Build and push termine en verde y actualiza Tags |
| Bruno no abre la colección | Selecciona la carpeta bruno que contiene bruno.json, no un archivo .bru |
| Bruno dice que no encuentra el archivo | Selecciona la foto desde Body > Multipart Form > photo; la ruta de ejemplo no incluye una foto |
| POST responde 400 | Verifica photo de tipo File, title/location/description y severity en mayúsculas |
| POST responde 413 | La imagen supera el límite de 5 MB |
| POST responde 500 | Revisa docker compose logs api; verifica AWS_REGION, bucket y credenciales sin mostrarlas en el video |
| S3 responde AccessDenied | Revisa política de lectura pública, ajustes de bloqueo y que uses la URL exacta del nuevo objeto |
| Error DNS, ENOENT o ENOTFOUND al acceder a S3 | En esta red se necesitó VPN; comprueba que esté activa para el equipo y que Docker también tenga salida a S3 |
| El correo no aparece | Revisa spam, MAIL_TO y logs de la API. 201 confirma el reporte, no recepción de correo |
| migrate aparece Exited (0) | Es correcto: terminó su tarea |
