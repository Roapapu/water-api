# Entrega — AguaFix: fotos en S3 y publicación Docker

## Datos del alumno

- Nombre: **Completar**.
- Materia y grupo: **Completar**.
- Fecha de entrega: **Completar con la fecha de envío**.

## Enlaces requeridos

1. Repositorio Git: https://github.com/Roapapu/water-api
2. Imagen Docker Hub: https://hub.docker.com/r/roapadilla/aquafix-api
3. Video: **Pegar aquí el enlace del video con permisos de visualización para el profesor**.

Imagen para descarga: `roapadilla/aquafix-api:latest`.

## Descripción de la implementación

Se amplió la API del primer parcial para recibir una foto obligatoria al crear reportes. `POST /reports` recibe los campos del DTO y el archivo `photo` mediante multipart. `StorageModule` exporta `StorageService`, cuyo método `uploadFile(file, folder): Promise<string>` utiliza `@aws-sdk/client-s3`, guarda el objeto bajo `reports/` y devuelve su URL pública.

La entidad `WATER_REPORT` incorpora `photoUrl`, `repairPhotoUrl` y `phone`. Se agregó una migración nueva manteniendo `synchronize: false`. Las columnas permiten null para conservar reportes previos; el endpoint exige foto en los reportes nuevos. `repairPhotoUrl` se devuelve como null mientras no exista una foto de reparación. No se agregó un endpoint de reparación porque no se solicita en esta entrega.

El correo conserva la información del reporte y agrega teléfono e imagen mediante `<img src="...">`. La API se distribuye mediante una imagen con `node:22-alpine`, ejecutada con `node dist/main`. Compose levanta PostgreSQL, ejecuta migraciones compiladas y después inicia la API utilizando la imagen de Docker Hub.

GitHub Actions se ejecuta con cada push a main. El workflow utiliza `secrets.DOCKER_USER` y `secrets.DOCKER_PASSWORD` para publicar el tag latest. `.env`, compose, node_modules, dist y .git están excluidos del contexto Docker; las credenciales se proporcionan al ejecutar la aplicación.

## Herramienta de consultas

Las solicitudes del video se realizan en Bruno con la colección incluida en `bruno/`. Se demuestra el mismo intercambio HTTP: multipart con archivo photo, respuesta 201, listado con ambas URLs y rechazo 400 cuando falta la foto.

La consigna original menciona Postman. Si el profesor requiere específicamente esa aplicación, se debe confirmar que acepta Bruno o repetir la solicitud multipart en Postman antes de entregar.

## Evidencia que debe verse en el video

| Orden | Evidencia | Qué debe comprobarse |
| --- | --- | --- |
| 1 | Cambio de código, commit y push a main | Se ve la modificación, el commit y la confirmación del push |
| 2 | GitHub Actions | Se ve la ejecución correspondiente al commit terminar en verde |
| 3 | Docker Hub | Tag latest con fecha de publicación actualizada |
| 4 | Bruno | POST /reports con archivo photo y respuesta 201 con photoUrl |
| 5 | S3 | El objeto de esa misma URL existe bajo reports/ |
| 6 | Correo | La alerta contiene la imagen visible y los datos del reporte |
| Extra | Bruno | GET incluye ambas URLs; POST sin foto responde 400 |

## Estado de las evidencias

- La validación local automatizada se guarda en `evidencias/validacion-local.json` al ejecutar `node scripts/generate-evidence.mjs`.
- Ese archivo contiene resultados reales del momento de ejecución. No sustituye el video.
- La publicación de Actions y Docker Hub se acredita con la ejecución y las pantallas posteriores al push, no con una compilación local.
- Completar el enlace del video y los datos del alumno antes de enviar este documento.

## Archivos principales para revisión

- `src/storage/storage.module.ts` y `src/storage/storage.service.ts`.
- `src/reports/reports.controller.ts`, `reports.service.ts`, entidad y DTO.
- `src/reports/templates/report.template.ts`.
- `src/migrations/1792772000000-AddReportPhotosAndPhone.ts`.
- `Dockerfile`, `.dockerignore` y `compose.yaml`.
- `.github/workflows/docker-publish.yml`.
- `bruno/` y `evidencias/GUIA-DE-GRABACION.md`.
