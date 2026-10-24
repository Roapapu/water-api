# Validaciones realizadas

Estas son pruebas técnicas reales de preparación. No sustituyen el video obligatorio ni acreditan todavía la publicación remota mediante Actions.

## Bruno

Se ejecutó la colección `bruno/` con Bruno CLI 4.3.0 contra `http://localhost:3000`.

| Solicitud | Estado obtenido | Tests |
| --- | --- | --- |
| GET / | 200 OK | 1 aprobado |
| POST /reports con foto de ensayo | 201 Created | 3 aprobados |
| GET /reports | 200 OK | 2 aprobados |
| POST /reports sin foto | 400 Bad Request | 1 aprobado |

Resultado: **4 solicitudes aprobadas y 7 de 7 tests aprobados**.

Archivos originales del runner: `bruno-validacion.json` y `bruno-validacion.html`. Se omitieron los cuerpos de respuesta en esos reportes para evitar copiar todos los datos de los reportes ciudadanos. Los tests sí se ejecutaron sobre las respuestas completas.

El envío de ensayo creó el reporte #4. SMTP confirmó que aceptó su correo. La recepción en la bandeja y la imagen visible deben mostrarse en el video; no se han sustituido por una captura de logs.

## API, S3 y Docker

El archivo `validacion-local.json` registra la fecha y hora reales de ejecución, el commit de referencia, la existencia de cambios pendientes, estados HTTP y servicios Docker. Se genera con `node scripts/generate-evidence.mjs`.

Se comprobó la exclusión de .env, compose y .git de la imagen, así como la ausencia de variables de credenciales incrustadas en la configuración de la imagen. .env está ignorado y no versionado.

Durante la sesión se detectó un problema de resolución DNS de S3. El acceso público y el POST con foto funcionaron con la VPN activa para el equipo. Mantener esa conexión durante las pruebas y el video.

## Foto y grabación pendientes

La imagen usada para el ensayo es la foto de pizarrón que el alumno había subido a prueba.jpeg. Para la entrega debe elegirse una foto de una fuga en Bruno y repetir el POST durante la grabación.

El cambio de código, commit y push se dejan para que el alumno los muestre al inicio del video. Después debe registrar el workflow en ejecución y en verde, latest actualizado en Docker Hub, el nuevo POST, el objeto exacto de S3 y el correo recibido con la foto visible.
