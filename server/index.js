import "dotenv/config";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const dataDir = path.join(__dirname, "data");
const ordersFile = path.join(dataDir, "orders.json");

const PORT = Number(process.env.PORT || 8787);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "pedidos@totustuus.com";
const ADMIN_BASIC_USER = process.env.ADMIN_BASIC_USER || "admin";
const ADMIN_BASIC_PASS = process.env.ADMIN_BASIC_PASS || "cambia-esta-clave";
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = process.env.SMTP_SECURE === "true";
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || ADMIN_EMAIL;

fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, "[]", "utf8");
}

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN, credentials: false }));
app.use(express.json());

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
  return `€${Number(price).toFixed(2).replace(".", ",")} EUR`;
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

async function sendOrderEmails(order) {
  const transporter = createTransporter();
  if (!transporter) {
    return { sent: false, reason: "smtp_not_configured" };
  }

  const adminSubject = `Nuevo pedido ${order.id} - ${order.cliente.nombre}`;
  const customerSubject = `Hemos recibido tu pedido ${order.id}`;
  const orderText = buildOrderText(order);

  await transporter.sendMail({
    from: SMTP_FROM,
    to: ADMIN_EMAIL,
    subject: adminSubject,
    text: orderText,
  });

  await transporter.sendMail({
    from: SMTP_FROM,
    to: order.cliente.email,
    subject: customerSubject,
    text: `Hola ${order.cliente.nombre},\n\nHemos recibido tu pedido correctamente.\n\n${orderText}\n\nGracias por confiar en ToTusTuus.`,
  });

  return { sent: true };
}

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || "";
  const [scheme, encoded] = auth.split(" ");

  if (scheme !== "Basic" || !encoded) {
    res.setHeader("WWW-Authenticate", 'Basic realm="ToTusTuus Admin"');
    return res.status(401).json({ message: "Autenticaci?n requerida" });
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
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "No se pudo reenviar el email" });
  }
});

app.post("/api/orders", async (req, res) => {
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

  const total = form.items.reduce(
    (sum, item) => sum + Number(item.product.price) * Number(item.qty),
    0,
  );

  const order = {
    id: `TTU-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
    fecha: new Date().toLocaleDateString("es-ES"),
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
    productos: form.items.map((item) => ({
      nombre: item.product.name,
      talla: item.size,
      cantidad: item.qty,
      precio: item.product.price,
    })),
    total,
    estado: "Pendiente",
    notas: form.notes || "",
  };

  const orders = readOrders();
  orders.unshift(order);
  writeOrders(orders);

  try {
    const emailResult = await sendOrderEmails(order);
    res.status(201).json({ order, emailResult });
  } catch (error) {
    res.status(201).json({
      order,
      emailResult: { sent: false, reason: "smtp_error" },
    });
  }
});

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("/admin-pedidos", requireAdmin, (req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
  app.get("/{*path}", (req, res) => {
    if (req.path.startsWith("/api/")) {
      return res.status(404).end();
    }
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
