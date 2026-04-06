# ToTusTuus Web

Tienda web de ToTusTuus construida con React + Vite y un backend en Express para gestionar pedidos, correos autom?ticos y una p?gina independiente de administraci?n.

## Descripci?n

Este proyecto reproduce la web de la marca ToTusTuus con cat?logo, fichas de producto, carrito, checkout y una capa backend para que los pedidos no dependan de l?gica sensible en frontend.

## Funcionalidades

- Cat?logo y fichas de producto
- Carrito de compra
- Checkout con creaci?n real de pedidos en backend
- P?gina de gesti?n de pedidos independiente del frontend de tienda
- Env?o de email al administrador y al cliente
- Assets locales, sin dependencia de im?genes remotas de Shopify

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

Crea un archivo `.env` en la ra?z tomando como base `.env.example`.

Variables necesarias:

```env
PORT=8787
CLIENT_ORIGIN=http://localhost:5173
VITE_API_BASE=http://localhost:8787/api

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
npm run preview
npm run start
```

### Desarrollo

`npm run dev` levanta:

- Frontend Vite en `http://localhost:5173`
- Backend Express en `http://localhost:8787`
- La tienda usa `VITE_API_BASE` para apuntar a la API; en desarrollo puede ir a `http://localhost:8787/api`

## Panel de administraci?n

La gesti?n de pedidos ya no forma parte del frontend p?blico.

El backend sirve directamente su propia p?gina de administraci?n en:

```txt
http://localhost:8787/
```

El acceso est? protegido por `Basic Auth` del servidor usando `ADMIN_BASIC_USER` y `ADMIN_BASIC_PASS`.

## Estructura

```txt
src/               frontend React
public/            im?genes y assets est?ticos
server/            API Express, panel admin independiente y almacenamiento de pedidos
server/admin/      interfaz propia de gesti?n de pedidos
server/data/       datos persistidos localmente en desarrollo
shared/            cat?logo compartido para validaci?n de pedidos
```

## Notas

- `server/data/orders.json` no se versiona para no subir pedidos reales.
- `dist/` y `node_modules/` tampoco se versionan.
- Para que el env?o de emails funcione de verdad necesitas un SMTP real configurado.
