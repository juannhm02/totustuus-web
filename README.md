# ToTusTuus Web

Tienda web de ToTusTuus construida con React + Vite y un backend en Express para pedidos, correos automáticos y panel de administración.

## Descripción

Este proyecto reproduce la web de la marca ToTusTuus con:

- catálogo y fichas de producto
- carrito y checkout
- backend para registrar pedidos
- envío automático de correos al administrador y al cliente
- panel independiente de gestión de pedidos en `/admin`

La aplicación está montada para funcionar en un único servidor Node.js: la tienda pública, la API y el panel de administración comparten el mismo despliegue.

## Funcionalidades

- Catálogo de productos con fichas individuales
- Carrito persistido en navegador
- Checkout conectado a backend real
- Validación de productos, tallas y precios en servidor
- Creación de pedidos en backend
- Emails automáticos con formato HTML
- Email al administrador y confirmación al cliente
- Panel de administración protegido con Basic Auth
- Página de términos y políticas integrada en la web
- Assets locales, sin dependencia de imágenes remotas de Shopify

## Stack

- React 18
- Vite 5
- React Router
- Express 5
- Nodemailer
- Node.js 20

## Scripts

```bash
npm install
npm run dev
npm run build
npm start
```

## Desarrollo local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Crear `.env`

Crea un archivo `.env` en la raíz tomando como base `.env.example`.

Ejemplo:

```env
PORT=8787
CLIENT_ORIGIN=http://localhost:8787
VITE_API_BASE=/api

ADMIN_EMAIL=tu-correo@dominio.com
ADMIN_BASIC_USER=admin
ADMIN_BASIC_PASS=cambia-esta-clave-larga-y-segura

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-correo@gmail.com
SMTP_PASS=tu-contrasena-de-aplicacion
SMTP_FROM=ToTusTuus <tu-correo@gmail.com>
```

### 3. Arrancar la app

```bash
npm run dev
```

Rutas en local:

- Tienda: `http://localhost:8787/`
- Panel admin: `http://localhost:8787/admin`
- API: `http://localhost:8787/api`

## Variables de entorno

- `PORT`: puerto único donde se sirve la tienda, el panel y la API.
- `CLIENT_ORIGIN`: origen público de la aplicación.
- `VITE_API_BASE`: base de la API usada por el frontend. En este proyecto debe ser `/api`.
- `ADMIN_EMAIL`: correo del administrador que recibe los pedidos.
- `ADMIN_BASIC_USER`: usuario del acceso al panel `/admin`.
- `ADMIN_BASIC_PASS`: contraseña del acceso al panel `/admin`.
- `SMTP_HOST`: servidor SMTP del proveedor de correo.
- `SMTP_PORT`: puerto SMTP.
- `SMTP_SECURE`: `true` si usas SSL directo, `false` si usas STARTTLS.
- `SMTP_USER`: usuario SMTP.
- `SMTP_PASS`: contraseña SMTP o contraseña de aplicación.
- `SMTP_FROM`: remitente visible en los correos.

## Correos automáticos

Cuando se crea un pedido, el backend:

- registra el pedido
- responde rápido al frontend
- envía en segundo plano un email al administrador
- envía en segundo plano un email de confirmación al cliente

Los emails se generan en HTML e incluyen:

- cabecera visual de marca
- logo embebido
- resumen del pedido
- productos solicitados
- total del pedido
- imágenes de producto embebidas cuando están disponibles

### Configuración recomendada con Gmail

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-correo@gmail.com
SMTP_PASS=tu-contrasena-de-aplicacion
SMTP_FROM=ToTusTuus <tu-correo@gmail.com>
```

Importante:

- no uses tu contraseña normal de Gmail
- usa una contraseña de aplicación de Google
- necesitas tener activada la verificación en dos pasos

## Panel de administración

El panel de gestión está en:

```txt
/admin
```

Está protegido mediante Basic Auth usando:

- `ADMIN_BASIC_USER`
- `ADMIN_BASIC_PASS`

Desde el panel puedes:

- ver pedidos
- cambiar el estado del pedido
- reenviar emails
- eliminar pedidos

## Producción

### Build y arranque

```bash
npm run build
npm start
```

En producción, Express sirve:

- el frontend compilado desde `dist`
- la API en `/api`
- el panel admin en `/admin`

## Despliegue

### Render

Este proyecto está preparado para desplegarse como servicio Node.js en Render.

Configuración recomendada:

- Build Command: `npm install --production=false && npm run build`
- Start Command: `npm start`

Variables necesarias:

- `PORT`
- `CLIENT_ORIGIN`
- `VITE_API_BASE`
- `ADMIN_EMAIL`
- `ADMIN_BASIC_USER`
- `ADMIN_BASIC_PASS`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

Si usas dominio propio, recuerda actualizar:

```env
CLIENT_ORIGIN=https://tu-dominio.com
```

### Hostinger

Este proyecto no se puede publicar en un hosting estático simple. Necesita Node.js porque usa:

- backend Express
- panel admin
- API de pedidos
- envío de correos

Para desplegarlo en Hostinger necesitas un plan compatible con aplicaciones Node.js, como `Business Web Hosting` o superior.

## Estructura

```txt
src/                frontend React de la tienda
public/             imágenes y assets estáticos
server/             backend Express y arranque unificado
server/admin/       interfaz del panel de pedidos
server/data/        almacenamiento local de pedidos en desarrollo
shared/             catálogo compartido para validación en backend
```

## Notas importantes

- `.env` no se versiona y no debe subirse a Git.
- `server/data/orders.json` no se versiona para no subir pedidos reales.
- `dist/` y `node_modules/` tampoco se versionan.
- La persistencia actual de pedidos está basada en JSON local; para un entorno de producción más sólido conviene migrar a base de datos.
- Si compartes o expones una contraseña SMTP o una contraseña de aplicación, debes rotarla inmediatamente.
