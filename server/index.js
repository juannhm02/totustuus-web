import "dotenv/config";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { createServer as createHttpServer } from "http";
import { fileURLToPath } from "url";
import { allowedSizes, productCatalogById } from "../shared/productCatalog.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const adminDir = path.join(__dirname, "admin");
const dataDir = path.join(__dirname, "data");
const ordersFile = path.join(dataDir, "orders.json");
const assetsDir = path.join(rootDir, "public", "shopify-assets");
const logoFile = path.join(
  rootDir,
  "public",
  "shopify-assets",
  "LogoCompletoBlanco.png",
);

const PORT = Number(process.env.PORT || 8787);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || `http://localhost:${PORT}`;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "pedidos@totustuus.com";
const ADMIN_BASIC_USER = process.env.ADMIN_BASIC_USER || "admin";
const ADMIN_BASIC_PASS = process.env.ADMIN_BASIC_PASS || "cambia-esta-clave";
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = process.env.SMTP_SECURE === "true";
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || ADMIN_EMAIL;
const isProduction = process.env.NODE_ENV === "production";

fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, "[]", "utf8");
}

function readOrders() {
  return JSON.parse(fs.readFileSync(ordersFile, "utf8"));
}

function writeOrders(orders) {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), "utf8");
}

function createTransporter() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

function formatPrice(price) {
  return `EUR ${Number(price).toFixed(2).replace(".", ",")}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createOrderCode(existingOrders, now = new Date()) {
  const datePart = now.toISOString().slice(0, 10).replaceAll("-", "");
  const prefix = `TT-${datePart}`;
  const maxSequence = existingOrders.reduce((max, order) => {
    if (typeof order.id !== "string" || !order.id.startsWith(`${prefix}-`)) {
      return max;
    }

    const sequence = Number(order.id.split("-").at(-1));
    return Number.isInteger(sequence) ? Math.max(max, sequence) : max;
  }, 0);

  return `${prefix}-${String(maxSequence + 1).padStart(3, "0")}`;
}

function buildOrderText(order) {
  return [
    `Pedido: ${order.id}`,
    `Fecha: ${order.fecha}`,
    "",
    "Cliente",
    `Nombre: ${order.cliente.nombre}`,
    `Email: ${order.cliente.email}`,
    `Teléfono: ${order.cliente.telefono || "-"}`,
    "",
    "Envío",
    `Dirección: ${order.envio.direccion}`,
    `Ciudad: ${order.envio.ciudad}`,
    `CP: ${order.envio.cp}`,
    "",
    "Productos",
    ...order.productos.map(
      (item) =>
        `- ${item.nombre} | Talla: ${item.talla} | Cantidad: ${item.cantidad} | Precio: ${formatPrice(item.precio)}`,
    ),
    "",
    `Total: ${formatPrice(order.total)}`,
    `Estado: ${order.estado}`,
    `Notas: ${order.notas || "-"}`,
  ].join("\n");
}

function buildProductsMarkup(order) {
  return order.productos
    .map(
      (item) => `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #e9e2cf;color:#203320;font:500 14px Arial,sans-serif;">
            <table role="presentation" cellspacing="0" cellpadding="0">
              <tr>
                <td style="width:72px;padding-right:14px;vertical-align:middle;">
                  ${
                    item.imageCid
                      ? `<img src="cid:${item.imageCid}" alt="${escapeHtml(item.nombre)}" style="width:72px;height:72px;object-fit:cover;display:block;background:#f5f1e8;" />`
                      : ""
                  }
                </td>
                <td style="vertical-align:middle;">
                  ${escapeHtml(item.nombre)}
                </td>
              </tr>
            </table>
          </td>
          <td style="padding:14px 0;border-bottom:1px solid #e9e2cf;color:#5f6656;font:400 14px Arial,sans-serif;text-align:center;">${escapeHtml(item.talla)}</td>
          <td style="padding:14px 0;border-bottom:1px solid #e9e2cf;color:#5f6656;font:400 14px Arial,sans-serif;text-align:center;">${item.cantidad}</td>
          <td style="padding:14px 0;border-bottom:1px solid #e9e2cf;color:#203320;font:600 14px Arial,sans-serif;text-align:right;">${formatPrice(item.precio)}</td>
        </tr>`,
    )
    .join("");
}

function buildEmailAttachments(order) {
  const attachments = [];
  const imageCidsByProduct = new Map();

  if (fs.existsSync(logoFile)) {
    attachments.push({
      filename: "totustuus-logo.png",
      path: logoFile,
      cid: "totustuus-logo",
    });
  }

  const seenProducts = new Set();
  for (const item of order.productos) {
    if (!item.productId) {
      continue;
    }

    if (imageCidsByProduct.has(item.productId)) {
      item.imageCid = imageCidsByProduct.get(item.productId);
      continue;
    }

    if (seenProducts.has(item.productId)) {
      continue;
    }

    const product = productCatalogById.get(item.productId);
    if (!product?.image) {
      continue;
    }

    const imagePath = path.join(assetsDir, product.image);
    if (!fs.existsSync(imagePath)) {
      continue;
    }

    const imageCid = `product-${product.id}`;
    item.imageCid = imageCid;
    imageCidsByProduct.set(item.productId, imageCid);
    attachments.push({
      filename: product.image,
      path: imagePath,
      cid: imageCid,
    });
    seenProducts.add(item.productId);
  }

  return attachments;
}

function buildEmailShell({ title, intro, order, ctaLabel, ctaHref }) {
  return `
    <!doctype html>
    <html lang="es">
      <body style="margin:0;padding:0;background:#f5f1e8;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f1e8;padding:28px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border-collapse:collapse;">
                <tr>
                  <td style="background:#132d14;padding:28px 32px;text-align:center;">
                    <img src="cid:totustuus-logo" alt="ToTusTuus" style="max-width:220px;width:100%;height:auto;display:block;margin:0 auto 18px;" />
                    <p style="margin:0;color:#d9cfb8;font:500 11px Arial,sans-serif;letter-spacing:0.25em;text-transform:uppercase;">Pedido ${escapeHtml(order.id)}</p>
                    <h1 style="margin:16px 0 0;color:#f8f3e6;font:400 34px Georgia,serif;line-height:1.18;">${escapeHtml(title)}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px;">
                    <p style="margin:0 0 22px;color:#33412d;font:400 15px/1.8 Arial,sans-serif;">${intro}</p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f1e8;border:1px solid #e6dfcd;margin-bottom:24px;">
                      <tr>
                        <td style="padding:18px 20px;">
                          <p style="margin:0 0 6px;color:#6d755f;font:600 11px Arial,sans-serif;letter-spacing:0.16em;text-transform:uppercase;">Cliente</p>
                          <p style="margin:0;color:#203320;font:400 14px/1.8 Arial,sans-serif;">${escapeHtml(order.cliente.nombre)}<br>${escapeHtml(order.cliente.email)}<br>${escapeHtml(order.cliente.telefono || "-")}</p>
                        </td>
                        <td style="padding:18px 20px;">
                          <p style="margin:0 0 6px;color:#6d755f;font:600 11px Arial,sans-serif;letter-spacing:0.16em;text-transform:uppercase;">Envío</p>
                          <p style="margin:0;color:#203320;font:400 14px/1.8 Arial,sans-serif;">${escapeHtml(order.envio.direccion)}<br>${escapeHtml(order.envio.ciudad)} · ${escapeHtml(order.envio.cp)}<br>${escapeHtml(order.fecha)}</p>
                        </td>
                      </tr>
                    </table>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-bottom:24px;">
                      <thead>
                        <tr>
                          <th align="left" style="padding:0 0 12px;color:#6d755f;font:600 11px Arial,sans-serif;letter-spacing:0.16em;text-transform:uppercase;">Producto</th>
                          <th align="center" style="padding:0 0 12px;color:#6d755f;font:600 11px Arial,sans-serif;letter-spacing:0.16em;text-transform:uppercase;">Talla</th>
                          <th align="center" style="padding:0 0 12px;color:#6d755f;font:600 11px Arial,sans-serif;letter-spacing:0.16em;text-transform:uppercase;">Cantidad</th>
                          <th align="right" style="padding:0 0 12px;color:#6d755f;font:600 11px Arial,sans-serif;letter-spacing:0.16em;text-transform:uppercase;">Precio</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${buildProductsMarkup(order)}
                      </tbody>
                    </table>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#132d14;">
                      <tr>
                        <td style="padding:18px 20px;">
                          <p style="margin:0;color:#d9cfb8;font:600 11px Arial,sans-serif;letter-spacing:0.16em;text-transform:uppercase;">Total</p>
                          <p style="margin:8px 0 0;color:#ffffff;font:400 28px Georgia,serif;">${formatPrice(order.total)}</p>
                        </td>
                        <td style="padding:18px 20px;text-align:right;">
                          <a href="${ctaHref}" style="display:inline-block;padding:12px 18px;background:#f0ead8;color:#132d14;text-decoration:none;font:700 11px Arial,sans-serif;letter-spacing:0.12em;text-transform:uppercase;">${escapeHtml(ctaLabel)}</a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:24px 0 0;color:#6d755f;font:400 13px/1.8 Arial,sans-serif;">Notas del pedido: ${escapeHtml(order.notas || "-")}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`;
}

async function sendOrderEmails(order) {
  const transporter = createTransporter();
  if (!transporter) {
    return { sent: false, reason: "smtp_not_configured" };
  }

  const orderText = buildOrderText(order);
  const attachments = buildEmailAttachments(order);
  const adminHtml = buildEmailShell({
    title: "Nuevo pedido recibido",
    intro:
      "Se ha registrado un nuevo pedido para gestionar. Puedes revisarlo también desde el panel de administración de ToTusTuus.",
    order,
    ctaLabel: "Abrir panel",
    ctaHref: `${CLIENT_ORIGIN}/admin`,
  });
  const customerHtml = buildEmailShell({
    title: "Tu pedido ya está en marcha",
    intro: `Hola ${escapeHtml(order.cliente.nombre)}, hemos recibido tu pedido correctamente. Te enviaremos novedades en cuanto avancemos con la preparación.`,
    order,
    ctaLabel: "Volver a la tienda",
    ctaHref: CLIENT_ORIGIN,
  });

  await Promise.all([
    transporter.sendMail({
      from: SMTP_FROM,
      to: ADMIN_EMAIL,
      subject: `Nuevo pedido ${order.id} - ${order.cliente.nombre}`,
      text: orderText,
      html: adminHtml,
      attachments,
    }),
    transporter.sendMail({
      from: SMTP_FROM,
      to: order.cliente.email,
      subject: `Hemos recibido tu pedido ${order.id}`,
      text: `Hola ${order.cliente.nombre},\n\nHemos recibido tu pedido correctamente.\n\n${orderText}\n\nGracias por confiar en ToTusTuus.`,
      html: customerHtml,
      attachments,
    }),
  ]);

  return { sent: true };
}

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || "";
  const [scheme, encoded] = auth.split(" ");

  if (scheme !== "Basic" || !encoded) {
    res.setHeader("WWW-Authenticate", 'Basic realm="ToTusTuus Admin"');
    return res.status(401).json({ message: "Autenticación requerida" });
  }

  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const separatorIndex = decoded.indexOf(":");
  const username = separatorIndex >= 0 ? decoded.slice(0, separatorIndex) : "";
  const password = separatorIndex >= 0 ? decoded.slice(separatorIndex + 1) : "";

  if (username !== ADMIN_BASIC_USER || password !== ADMIN_BASIC_PASS) {
    res.setHeader("WWW-Authenticate", 'Basic realm="ToTusTuus Admin"');
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  next();
}

async function createApp() {
  const app = express();
  const httpServer = createHttpServer(app);

  app.use(cors({ origin: CLIENT_ORIGIN, credentials: false }));
  app.use(express.json());

  app.get("/api/admin/orders", requireAdmin, (req, res) => {
    res.json(readOrders());
  });

  app.patch("/api/admin/orders/:id", requireAdmin, (req, res) => {
    const { status } = req.body || {};
    const orders = readOrders();
    const nextOrders = orders.map((order) =>
      order.id === req.params.id ? { ...order, estado: status } : order,
    );
    writeOrders(nextOrders);
    res.json(nextOrders.find((order) => order.id === req.params.id));
  });

  app.delete("/api/admin/orders/:id", requireAdmin, (req, res) => {
    const orders = readOrders();
    const nextOrders = orders.filter((order) => order.id !== req.params.id);
    writeOrders(nextOrders);
    res.status(204).end();
  });

  app.post("/api/admin/orders/:id/resend-email", requireAdmin, async (req, res) => {
    const orders = readOrders();
    const order = orders.find((item) => item.id === req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    try {
      const result = await sendOrderEmails(order);
      return res.json(result);
    } catch {
      return res.status(500).json({ message: "No se pudo reenviar el email" });
    }
  });

  app.post("/api/orders", (req, res) => {
    const form = req.body || {};

    if (
      !form.fullName?.trim() ||
      !form.email?.trim() ||
      !form.address?.trim() ||
      !form.city?.trim() ||
      !form.postalCode?.trim() ||
      !Array.isArray(form.items) ||
      !form.items.length
    ) {
      return res.status(400).json({ message: "Datos de pedido incompletos" });
    }

    const normalizedItems = [];

    for (const item of form.items) {
      const productId = Number(item.productId);
      const qty = Number(item.qty);
      const size = String(item.size || "").trim();
      const product = productCatalogById.get(productId);

      if (!product) {
        return res.status(400).json({ message: "Producto no válido" });
      }

      if (!allowedSizes.includes(size)) {
        return res.status(400).json({ message: "Talla no válida" });
      }

      if (!Number.isInteger(qty) || qty <= 0) {
        return res.status(400).json({ message: "Cantidad no válida" });
      }

      normalizedItems.push({
        productId: product.id,
        nombre: product.name,
        talla: size,
        cantidad: qty,
        precio: product.price,
        imageCid: "",
      });
    }

    const total = normalizedItems.reduce(
      (sum, item) => sum + Number(item.precio) * Number(item.cantidad),
      0,
    );
    const orders = readOrders();
    const now = new Date();

    const order = {
      id: createOrderCode(orders, now),
      fecha: now.toLocaleString("es-ES", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      cliente: {
        nombre: form.fullName,
        email: form.email,
        telefono: form.phone || "",
      },
      envio: {
        direccion: form.address,
        ciudad: form.city,
        cp: form.postalCode,
      },
      productos: normalizedItems,
      total,
      estado: "Pendiente",
      notas: form.notes || "",
    };

    orders.unshift(order);
    writeOrders(orders);

    res.status(201).json({
      order,
      emailResult: { queued: true },
    });

    void sendOrderEmails(order).catch((error) => {
      console.error(`No se pudieron enviar los emails del pedido ${order.id}`, error);
    });

    return undefined;
  });

  app.get("/api", (req, res) => {
    res.json({
      ok: true,
      routes: [
        "POST /api/orders",
        "GET /api/admin/orders",
        "PATCH /api/admin/orders/:id",
        "DELETE /api/admin/orders/:id",
        "POST /api/admin/orders/:id/resend-email",
      ],
    });
  });

  if (fs.existsSync(adminDir)) {
    app.use(
      "/admin-static",
      requireAdmin,
      express.static(adminDir, { index: false }),
    );

    app.get("/admin", requireAdmin, (req, res) => {
      res.sendFile(path.join(adminDir, "index.html"));
    });
  }

  if (isProduction) {
    if (fs.existsSync(distDir)) {
      app.use(express.static(distDir));
      app.get("/{*path}", (req, res, next) => {
        if (req.path.startsWith("/api") || req.path.startsWith("/admin")) {
          return next();
        }

        return res.sendFile(path.join(distDir, "index.html"));
      });
    }
  } else {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
      },
      appType: "spa",
    });

    app.use(vite.middlewares);

    app.get("/{*path}", async (req, res, next) => {
      if (req.path.startsWith("/api") || req.path.startsWith("/admin")) {
        return next();
      }

      try {
        const indexPath = path.join(rootDir, "index.html");
        let template = fs.readFileSync(indexPath, "utf8");
        template = await vite.transformIndexHtml(req.originalUrl, template);
        return res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (error) {
        vite.ssrFixStacktrace(error);
        return next(error);
      }
    });
  }

  return { app, httpServer };
}

const { httpServer } = await createApp();

httpServer.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `El puerto ${PORT} ya está en uso. Cierra el proceso anterior o cambia PORT en tu .env.`,
    );
    process.exit(1);
  }

  throw error;
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
