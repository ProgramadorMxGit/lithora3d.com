# Operación local y despliegue

## Contenido del ecosistema

La fuente mantenible es `ecosistema-soluciones/content.js`. Los nueve nichos aprobados el 2026-07-20 usan `published`; el generador solo publica registros completos con aprobación comercial identificable. Los productos son ejemplos comerciales personalizables, no un catálogo rígido.

Flujo editorial:

1. Editar, agregar, ocultar o reordenar un registro en `content.js`.
2. Mantener `updatedAt`, categoría, estado de publicación, aprobación comercial, SEO, CTA y procedencia visual.
3. Ejecutar `npm run content:render`; el generador excluye estados no publicables y registros incompletos.
4. Ejecutar `npm run validate` y `npm run content:check`.
5. Conservar `Ejemplo conceptual` en todo recurso OpenArt. Una imagen conceptual nunca cambia a `real`; un proyecto real exige `approvedAsRealProject: true` y evidencia autorizada.

## Cotización y analítica

- El canal principal es WhatsApp en `https://wa.me/528331080178` (`+52 833 108 0178`).
- El formulario prepara un mensaje editable y conserva categoría, nicho, aplicación, tipo visual y URL de origen en el texto de WhatsApp.
- Abrir WhatsApp produce el estado `handoff`, nunca una confirmación falsa: el visitante debe revisar y enviar el mensaje dentro de WhatsApp. `success` queda reservado para una respuesta real de backend con `accepted: true` si en el futuro se integra uno.
- Nombre y correo son opcionales y no se transfieren a WhatsApp. Los adjuntos se seleccionan/comparten manualmente allí; esta web no carga ni almacena el archivo.
- Si el navegador bloquea la ventana, la interfaz conserva el contexto, muestra error y ofrece el enlace directo. Si se retira o invalida el destino, muestra `channel not configured` sin pérdida de datos.
- La analítica emite los nueve eventos a `dataLayer` cuando existe y siempre como `CustomEvent`; sin proveedor es no-op. Para producción, el responsable de marketing debe conectar la cuenta y consentimiento sin modificar la interfaz.

## Checklist de despliegue

- [x] Contenido inicial, referencia visual y uso conceptual aprobados el 2026-07-20.
- [x] Verificar que `https://wa.me/528331080178` abre el número oficial y conserva el contexto desde la candidata y producción, sin enviar un mensaje de prueba.
- [ ] Blocked externally — Conectar la cuenta de analítica y consentimiento. Dependencia: proveedor/cuenta y decisión de privacidad; propietario: marketing/analítica y privacidad de Lithora 3D; siguiente acción: conectar el `dataLayer` existente sin ampliar los payloads mínimos.
- [x] Ejecutar `npm run content:check`, `npm run validate`, validación Chrome DevTools y auditoría estática incluida en la suite.
- [x] Revisar `audits/2026-07-20/` y confirmar cero errores relevantes de consola.
- [x] Servir la raíz por HTTPS preservando rutas con `index.html` y MIME JavaScript.
- [x] Verificar `/ecosistema-soluciones/`, `robots.txt`, `sitemap.xml`, canonical y enlaces tras subir.
- [x] Registrar despliegue: 2026-07-20, commit `b12f3a3`, responsable `ProgramadorMxGit`, GitHub Pages workflow #6 (`29792520866`).

## Arquitectura productiva confirmada

- Repositorio y publicación: GitHub `ProgramadorMxGit/lithora3d.com`, rama `main`, carpeta raíz, GitHub Pages mediante `pages-build-deployment`.
- DNS, proxy HTTPS y señales administradas de `robots.txt`: Cloudflare.
- Registrador del dominio `lithora3d.com`: Namecheap, delegado a los nameservers de Cloudflare.
- No existe un entorno de staging separado; la candidata se valida en el servidor local equivalente y luego se promueve sin transformar los archivos.

## Rollback

1. Identificar el último commit validado y el commit desplegado.
2. Crear un revert no destructivo del commit desplegado (`git revert <commit>`); no reescribir historia.
3. Volver a desplegar el artefacto del último commit validado.
4. Repetir las verificaciones de ruta, canal WhatsApp disponible/error, sitemap, consola y enlaces.
5. Registrar causa, alcance y resultado en `changes.md`.
