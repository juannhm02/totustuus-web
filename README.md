# ToTusTuus Web

Tienda web de ToTusTuus construida con React + Vite y un backend en Express para gestionar pedidos, correos automáticos y una página independiente de administración, todo en el mismo puerto.

## Descripción

Este proyecto reproduce la web de la marca ToTusTuus con catálogo, fichas de producto, carrito y checkout, mientras que Express centraliza la API y sirve tanto la tienda como el panel de gestión.

## Funcionalidades

- Catálogo y fichas de producto
- Carrito de compra
- Checkout con creación real de pedidos en backend
- Página de gestión de pedidos protegida en `/admin`
- Envío de email al administrador y al cliente
- Assets locales, sin dependencia de imágenes remotas de Shopify

## Stack

- React 18
- Vite 5
- React Router
- Express 5
- Nodemailer

## Puesta en marcha

### 1. Instalar dependencias

```bash
npm install
```

### 2. Crear el `.env`

Crea un archivo `.env` en la raíz tomando como base `.env.example`.

Ejemplo:

```env
PORT=8787
CLIENT_ORIGIN=http://localhost:8787
VITE_API_BASE=/api

ADMIN_EMAIL=tu-correo@dominio.com
ADMIN_BASIC_USER=totustuus-admin
ADMIN_BASIC_PASS=cambia-esta-clave-larga-y-segura

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-correo@gmail.com
SMTP_PASS=tu-contrasena-de-aplicacion
SMTP_FROM=ToTusTuus <tu-correo@gmail.com>
```

## Qué significa cada variable

- `PORT`: puerto único donde se sirve la tienda, el panel y la API.
- `CLIENT_ORIGIN`: origen público de la app.
- `VITE_API_BASE`: base de la API para el frontend. En este proyecto debe ser `/api`.
- `ADMIN_EMAIL`: correo del administrador que recibirá los pedidos.
- `ADMIN_BASIC_USER`: usuario del acceso al panel `/admin`.
- `ADMIN_BASIC_PASS`: contraseña del acceso al panel `/admin`.
- `SMTP_HOST`: servidor SMTP del proveedor de correo.
- `SMTP_PORT`: puerto SMTP.
- `SMTP_SECURE`: `true` si usas SSL directo, `false` si usas STARTTLS.
- `SMTP_USER`: usuario SMTP.
- `SMTP_PASS`: contraseña SMTP o contraseña de aplicación.
- `SMTP_FROM`: remitente visible en los correos.

## Correos: cómo hacer que funcionen bien

Cuando se crea un pedido, el backend envía:

- un email al administrador en `ADMIN_EMAIL`
- un email de confirmación al cliente con el correo que haya puesto en el checkout

### Opción recomendada para empezar: Gmail

Usa esta configuración:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-correo@gmail.com
SMTP_PASS=tu-contrasena-de-aplicacion
SMTP_FROM=ToTusTuus <tu-correo@gmail.com>
```

Importante:

- No uses tu contraseña normal de Gmail.
- Usa una contraseña de aplicación de Google.
- Para eso necesitas tener activada la verificación en dos pasos en tu cuenta.

### Si usas otro proveedor

Solo cambia:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

## Cómo probar que llegan los dos correos

1. Arranca la app con:

```bash
npm run dev
```

2. Abre la tienda en:

```txt
http://localhost:8787/
```

3. Haz un pedido de prueba con un correo tuyo en el checkout.

4. Comprueba:

- que el administrador recibe el email en `ADMIN_EMAIL`
- que el cliente recibe la confirmación en el email que haya introducido

5. Si no llegan:

- revisa spam
- revisa que `SMTP_USER` y `SMTP_PASS` sean correctos
- revisa que `SMTP_FROM` use un remitente permitido por tu proveedor

## Scripts

```bash
npm run dev
npm run build
npm run start
```

### Desarrollo

`npm run dev` levanta un único servidor en:

- Tienda: `http://localhost:8787/`
- Panel admin: `http://localhost:8787/admin`
- API: `http://localhost:8787/api`

## Producción

```bash
npm run build
npm run start
```

En producción, Express sirve el frontend compilado desde `dist` y mantiene el panel admin en `/admin`.

## Estructura

```txt
src/               frontend React de la tienda
public/            imágenes y assets estáticos
server/            API Express, panel admin y arranque unificado
server/admin/      interfaz propia de gestión de pedidos
server/data/       datos persistidos localmente en desarrollo
shared/            catálogo compartido para validación de pedidos
```

## Notas

- `server/data/orders.json` no se versiona para no subir pedidos reales.
- `dist/` y `node_modules/` tampoco se versionan.
- Para que el envío de emails funcione de verdad necesitas un SMTP real configurado.
