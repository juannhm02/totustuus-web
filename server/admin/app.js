const ordersList = document.getElementById("ordersList");
const loadingCard = document.getElementById("loadingCard");
const emptyCard = document.getElementById("emptyCard");
const errorNode = document.getElementById("error");
const noticeNode = document.getElementById("notice");
const reloadButton = document.getElementById("reloadButton");
const orderTemplate = document.getElementById("orderTemplate");

function formatPrice(price) {
  return `EUR ${Number(price).toFixed(2).replace(".", ",")}`;
}

function appendTextCell(parent, text) {
  const cell = document.createElement("span");
  cell.textContent = text;
  parent.appendChild(cell);
}

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(data?.message || "Error de servidor");
  }

  return data;
}

function setError(message) {
  errorNode.textContent = message || "";
  errorNode.hidden = !message;
}

function setNotice(message) {
  noticeNode.textContent = message || "";
  noticeNode.hidden = !message;
}

function renderOrders(orders) {
  ordersList.innerHTML = "";
  emptyCard.hidden = orders.length > 0;

  for (const order of orders) {
    const fragment = orderTemplate.content.cloneNode(true);
    const article = fragment.querySelector(".order-card");
    const statusSelect = fragment.querySelector(".order-status");
    const resendButton = fragment.querySelector(".resend-button");
    const deleteButton = fragment.querySelector(".delete-button");
    const productsList = fragment.querySelector(".products-list");

    fragment.querySelector(".order-kicker").textContent = order.fecha;
    fragment.querySelector(".order-id").textContent = order.id;
    fragment.querySelector(".customer-name").textContent = order.cliente.nombre;
    fragment.querySelector(".customer-email").textContent = order.cliente.email;
    fragment.querySelector(".customer-phone").textContent =
      order.cliente.telefono || "-";
    fragment.querySelector(".shipping-address").textContent =
      order.envio.direccion;
    fragment.querySelector(".shipping-city").textContent = order.envio.ciudad;
    fragment.querySelector(".shipping-postal").textContent = order.envio.cp;
    fragment.querySelector(".order-state").textContent = `Estado: ${order.estado}`;
    fragment.querySelector(".order-total").textContent = `Total: ${formatPrice(order.total)}`;
    fragment.querySelector(".order-notes").textContent = `Notas: ${order.notas || "-"}`;

    statusSelect.value = order.estado;

    statusSelect.addEventListener("change", async (event) => {
      try {
        const updatedOrder = await apiRequest(`/api/admin/orders/${order.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: event.target.value }),
        });
        order.estado = updatedOrder.estado;
        fragment.querySelector(".order-state").textContent = `Estado: ${updatedOrder.estado}`;
        setNotice(`Estado actualizado a ${updatedOrder.estado}`);
        setError("");
      } catch (error) {
        event.target.value = order.estado;
        setError(error.message);
      }
    });

    resendButton.addEventListener("click", async () => {
      try {
        const result = await apiRequest(`/api/admin/orders/${order.id}/resend-email`, {
          method: "POST",
        });
        if (result?.sent) {
          setNotice("Emails reenviados correctamente");
          setError("");
          return;
        }
        setError("SMTP no configurado. El pedido está guardado, pero no se pudo enviar el correo.");
      } catch (error) {
        setError(error.message);
      }
    });

    deleteButton.addEventListener("click", async () => {
      try {
        await apiRequest(`/api/admin/orders/${order.id}`, { method: "DELETE" });
        article.remove();
        setNotice("Pedido eliminado");
        setError("");
        if (!ordersList.children.length) {
          emptyCard.hidden = false;
        }
      } catch (error) {
        setError(error.message);
      }
    });

    for (const item of order.productos) {
      const row = document.createElement("div");
      row.className = "product-row";
      appendTextCell(row, item.nombre);
      appendTextCell(row, `Talla: ${item.talla}`);
      appendTextCell(row, `Cantidad: ${item.cantidad}`);
      appendTextCell(row, formatPrice(item.precio));
      productsList.appendChild(row);
    }

    ordersList.appendChild(fragment);
  }
}

async function loadOrders() {
  loadingCard.hidden = false;
  emptyCard.hidden = true;
  setError("");

  try {
    const orders = await apiRequest("/api/admin/orders");
    renderOrders(orders);
  } catch (error) {
    setError(error.message);
  } finally {
    loadingCard.hidden = true;
  }
}

reloadButton.addEventListener("click", loadOrders);

loadOrders();
