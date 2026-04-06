# ToTusTuus Web

Tienda web de ToTusTuus construida con React + Vite y un backend en Express para gestionar pedidos, panel de administración y correos automáticos.

## Descripción

Este proyecto reproduce la web de la marca ToTusTuus con catálogo, fichas de producto, carrito, checkout y una capa backend para que los pedidos no dependan de lógica sensible en frontend.

## Funcionalidades

- Catálogo y fichas de producto
- Carrito de compra
- Checkout con creación real de pedidos en backend
- Panel de administración protegido por contraseña y JWT
- Envío de email al administrador y al cliente
- Assets locales, sin dependencia de imágenes remotas de Shopify

## Stack

- React 18
- Vite 5
- React Router
- Express 5
- Nodemailer
- JSON Web Token

## Puesta en marcha

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz tomando como base `.env.example`.

Variables necesarias:

```env
PORT=8787
CLIENT_ORIGIN=http://localhost:5173

ADMIN_EMAIL=pedidos@totustuus.com
ADMIN_PASSWORD=cambia-esta-clave
ADMIN_JWT_SECRET=cambia-este-jwt-secret

SMTP_HOST=smtp.tu-proveedor.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=usuario-smtp
SMTP_PASS=clave-smtp
SMTP_FROM=ToTusTuus <pedidos@totustuus.com>
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run start
```

### Desarrollo

`npm run dev` levanta:

- Frontend Vite en `http://localhost:5173`
- Backend Express en `http://localhost:8787`

## Panel de administración

La ruta del panel es:

```txt
/admin-pedidos
```

El acceso se valida contra el backend con la contraseña definida en `.env`.

## Estructura

```txt
src/               frontend React
public/            imágenes y assets estáticos
server/            API Express y almacenamiento de pedidos
server/data/       datos persistidos localmente en desarrollo
```

## Notas

- `server/data/orders.json` no se versiona para no subir pedidos reales.
- `dist/` y `node_modules/` tampoco se versionan.
- Para que el envío de emails funcione de verdad necesitas un SMTP real configurado
