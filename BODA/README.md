# Boda Sebas & Marce – Página de confirmación

Pequeña landing estática para confirmar asistencia a la boda y ver cómo llegar a los lugares del evento. Pensada para alojarse gratis en GitHub Pages.

## Estructura

- `index.html`: contenido principal de la página.
- `styles.css`: estilos y diseño.
- `script.js`: lógica del formulario (personas por invitación y envío por correo).

## Cómo funciona la confirmación

- El formulario permite:
  - Datos de contacto de quien responde la invitación.
  - Indicar si, en general, asistirán o no.
  - Agregar varias personas por invitación (botón “Agregar otra persona”).
  - Comentarios adicionales (por ejemplo alergias o restricciones).
- Al enviar, se construye un correo y se abre la aplicación de email del invitado con el mensaje listo.

### Cambiar el correo de destino

En `script.js` busca esta línea:

```js
const mailToAddress = 'correo-de-los-novios@ejemplo.com';
```

Y reemplázala por el correo real donde quieres recibir las confirmaciones, por ejemplo:

```js
const mailToAddress = 'sebasyymarce@gmail.com';
```

## Cómo desplegar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `boda-sebas-marce`).
2. Copia los archivos `index.html`, `styles.css`, `script.js` y `README.md` a ese repositorio.
3. Haz commit y push a la rama `main` (o `master`).
4. En GitHub, ve a **Settings → Pages**.
5. En **Build and deployment**, elige:
   - **Source**: `Deploy from a branch`.
   - **Branch**: selecciona `main` (carpeta `/root`).
6. Guarda los cambios; GitHub generará una URL del estilo:

`https://tu-usuario.github.io/boda-sebas-marce`

Comparte esa URL en tus invitaciones.

## Personalización básica

- Textos principales (nombres, fecha, mensajes) están en `index.html`.
- Colores y tipografías se ajustan en `styles.css` (variables al inicio del archivo).
- Si quieres cambiar los horarios o añadir más información (código de vestimenta, mesa de regalos, etc.), puedes agregar secciones nuevas dentro de `index.html` siguiendo el mismo estilo.

