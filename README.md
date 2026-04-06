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

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz tomando como base `.env.example`.

Variables necesarias:

```env
PORT=8787
CLIENT_ORIGIN=http://localhost:8787
VITE_API_BASE=/api

ADMIN_EMAIL=pedidos@totustuus.com
ADMIN_BASIC_USER=admin
ADMIN_BASIC_PASS=cambia-esta-clave

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
