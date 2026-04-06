import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

const products = [
  {
    id: 1,
    name: 'Camiseta "Encendidos"',
    price: 22,
    type: "Camiseta",
    color: "Azul Acero",
    imgs: [
      "/shopify-assets/15.png",
      "/shopify-assets/16.png",
      "/shopify-assets/17.png",
      "/shopify-assets/18.png",
      "/shopify-assets/19.png",
    ],
    desc: 'La camiseta <em>"Encendidos"</em> destaca por su diseño en la parte trasera, con la frase <strong>«ENCENDIDOS POR TU AMOR»</strong> repetida y una llama roja central que simboliza pasión y fe. Un estilo moderno y juvenil, ideal para quienes desean expresar su fe de forma auténtica.',
    guides: [
      "/shopify-assets/Tallas_Camisetaspng.png",
      "/shopify-assets/Detalles_Camisetas_3cfe698f-9ce2-4348-a75a-0661fe8a9d22.png",
    ],
  },
  {
    id: 2,
    name: "Camiseta Sonrisa",
    price: 22,
    type: "Camiseta",
    color: "Blanco",
    imgs: [
      "/shopify-assets/20.png",
      "/shopify-assets/21.png",
      "/shopify-assets/22_ddabecb3-4beb-4d3b-89e6-4e038e23cec7.png",
      "/shopify-assets/23.png",
      "/shopify-assets/24.png",
    ],
    desc: "<p>Esta camiseta busca mostrar la <strong>sensibilidad</strong> de Cristo. En la parte trasera muestra una ilustraci\u00F3n de Jes\u00FAs consolando y devolviendo la sonrisa, junto a la frase <strong>\u201CDonde el mundo ve tristeza, \u00C9l dibuja esperanza\u201D</strong>.</p><p><strong>\u00BFC\u00F3mo la definir\u00EDa?</strong></p><p>Con tres palabras: <strong>luz, consuelo y una fe</strong> que transforma.</p>",
    guides: [
      "/shopify-assets/Tallas_Camisetaspng.png",
      "/shopify-assets/Detalles_Camisetas_3cfe698f-9ce2-4348-a75a-0661fe8a9d22.png",
    ],
  },
  {
    id: 3,
    name: "Camiseta Tres en Raya",
    price: 22,
    type: "Camiseta",
    color: "Negro",
    imgs: [
      "/shopify-assets/13_48058a1d-c72f-4d51-80e0-144312733223.png",
      "/shopify-assets/14_8a20afc5-44ed-4e09-bfec-d6509f2dde0d.png",
    ],
    desc: "<p><strong>Nuestra fe no es un juego</strong>, pero aun cuando queremos que sea as?, ah? tambi?n est? el Se?or.</p><p>De esta idea surge este dise?o, con la intenci?n de que sepamos que <strong><u>Dios</u> NUNCA</strong> nos <strong>ABANDONA</strong>.</p>",
    guides: [
      "/shopify-assets/Tallas_Camisetaspng.png",
      "/shopify-assets/Detalles_Camisetas_3cfe698f-9ce2-4348-a75a-0661fe8a9d22.png",
    ],
  },
  {
    id: 4,
    name: "Polar Media Cremallera Si Puedes",
    price: 35,
    type: "Polar",
    color: "Verde",
    imgs: [
      "/shopify-assets/11_173b46a5-59ec-46db-9164-5e4625b59553.png",
      "/shopify-assets/12_95768eb1-9fb9-49b3-a638-3d66bb7f8644.png",
      "/shopify-assets/14_d19ac5ff-3268-47b4-a142-225deea84237.png",
      "/shopify-assets/15_81836f5d-2aa4-4de0-8348-28491a48332c.png",
      "/shopify-assets/13_e53870c1-a97a-4632-b383-c3026ed1dcd7.png",
    ],
    desc: '<p>El polar que necesitas para afrontar el fr\u00EDo con estilo y un mensaje que fortalece tu fe. Ligero, c\u00E1lido y dise\u00F1ado para acompa\u00F1arte en cada aventura, es mucho m\u00E1s que una prenda t\u00E9cnica: es un recordatorio constante de que la fe mueve monta\u00F1as.</p><p>El nombre <strong>"Si Puedes"</strong> no es casualidad. Inspirado en la promesa de que todo es posible para quien cree (<em>Marcos 9:23</em>), esta chaqueta te invita a llevar tu fe contigo, visible y con orgullo, mientras disfrutas de la comodidad y protecci\u00F3n que necesitas.</p><p><strong>Lleva tu fe contigo. Viste totustuus.</strong></p>',
    guides: [
      "/shopify-assets/Tallas Micropolar.png",
      "/shopify-assets/Detalles Polar.png",
    ],
  },
  {
    id: 5,
    name: "Sudadera Confía",
    price: 28,
    type: "Sudadera",
    color: "Arena",
    imgs: [
      "/shopify-assets/6.png",
      "/shopify-assets/7.png",
      "/shopify-assets/8.png",
      "/shopify-assets/9.png",
      "/shopify-assets/10.png",
    ],
    desc: "Descubre la <strong>Sudadera Confía</strong>, una prenda que combina estilo, comodidad y un mensaje profundo de fe. Diseñada para acompañarte en tu día a día, es perfecta para quienes buscan expresar su identidad cristiana con autenticidad.<br><br>Esta sudadera es más que una prenda de vestir: es un recordatorio constante de que la fe nos acompaña en cada paso. Perfecta para llevar en encuentros de grupo, retiros o simplemente para sentirte cerca de Él.<br><br><strong>¡Viste tu fe con estilo!</strong>",
    guides: [
      "/shopify-assets/Tallas_Sudaderas.png",
      "/shopify-assets/Detalles_Sudaderas_1ca21a58-c411-4774-a8b8-4efff5afb1d3.png",
    ],
  },
  {
    id: 6,
    name: "Sudadera Sin Miedo Te Espero",
    price: 30,
    type: "Sudadera",
    color: "Negro",
    imgs: [
      "/shopify-assets/2.png",
      "/shopify-assets/3.png",
      "/shopify-assets/4.png",
      "/shopify-assets/sinmiedo.png",
      "/shopify-assets/5.png",
    ],
    desc: 'Sudadera con el mensaje "Sin Miedo Te Espero", un recordatorio de la presencia constante de Dios en nuestra vida. Diseño atrevido y cargado de significado para llevar tu fe con valentía.',
    guides: [
      "/shopify-assets/Tallas_Sudaderas.png",
      "/shopify-assets/Detalles_Sudaderas_1ca21a58-c411-4774-a8b8-4efff5afb1d3.png",
    ],
  },
];

const sizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
const categoryOptions = ["all", "Sudadera", "Camiseta", "Polar"];
const storageKeys = {
  cart: "ttu_react_cart",
};
const apiBase = "/api";
const aboutValues = [
  { title: "Fe viva", description: "Jesús es el centro de este proyecto." },
  {
    title: "Autenticidad",
    description: "Diseños reales, con historia y propósito.",
  },
  {
    title: "Calidad",
    description: "Prendas pensadas para durar y acompañarte.",
  },
  {
    title: "Juventud",
    description: "Estilo actual, cercano, con lenguaje propio.",
  },
  {
    title: "Misión",
    description: "Cada colección quiere encender, inspirar y tocar vidas.",
  },
];
const aboutIdentity = [
  "Una marca.",
  "Una familia.",
  "Una misión.",
  'Un "sí" que se renueva cada día. Hasta el final.',
];
const aboutQuotes = [
  "“Tu palabra es lámpara para mis pasos y luz en mi camino.” Salmo 119:105",
  "“Encomienda tu camino al Señor, confía en Él, y Él actuará.” Salmo 37:5",
  '"Vosotros sois la luz del mundo" Mateo 5:14-16',
];

function formatPrice(price) {
  return `\u20AC${price.toFixed(2).replace(".", ",")} EUR`;
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, {
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

async function createOrderRequest(payload) {
  return apiRequest("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function fetchAdminOrders() {
  return apiRequest("/admin/orders");
}

async function updateAdminOrderStatus(id, status) {
  return apiRequest(`/admin/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

async function deleteAdminOrder(id) {
  return apiRequest(`/admin/orders/${id}`, {
    method: "DELETE",
  });
}

async function resendAdminOrderEmail(id) {
  return apiRequest(`/admin/orders/${id}/resend-email`, {
    method: "POST",
  });
}

function Header({ cartCount, onOpenCart }) {
  return (
    <header>
      <div className="hi">
        <nav className="nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "act" : "")}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/catalogo"
            className={({ isActive }) => (isActive ? "act" : "")}
          >
            Catálogo
          </NavLink>
          <NavLink
            to="/contacto"
            className={({ isActive }) => (isActive ? "act" : "")}
          >
            Contacto
          </NavLink>
        </nav>
        <Link className="logo" to="/">
          <img src="/shopify-assets/LogoBasicoBlanco.png" alt="ToTusTuus" />
        </Link>
        <div className="hr">
          <button className="ibtn" onClick={onOpenCart}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className={`badge ${cartCount > 0 ? "on" : ""}`}>
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <div className="fi2">
        <div className="fl">
          <img src="/shopify-assets/LogoCompletoBlanco.png" alt="ToTusTuus" />
        </div>
        <div className="fg">
          <div className="fc">
            <h4>Tienda</h4>
            <ul>
              <li>
                <Link to="/catalogo?tipo=Sudadera">Sudaderas</Link>
              </li>
              <li>
                <Link to="/catalogo?tipo=Camiseta">Camisetas</Link>
              </li>
              <li>
                <Link to="/catalogo?tipo=Polar">Polares</Link>
              </li>
            </ul>
          </div>
          <div className="fc">
            <h4>Soporte</h4>
            <ul>
              <li>
                <Link to="/contacto">Contacto</Link>
              </li>
            </ul>
          </div>
          <div className="fc">
            <h4>Conócenos</h4>
            <ul>
              <li>
                <Link to="/contacto">Sobre nosotros</Link>
              </li>
              <li>
                <a href="#">Política de privacidad</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="fb2">
          <p className="fcp">
            © 2026 ToTusTuus. Todos los derechos reservados.
          </p>
          <div className="soc">
            <a
              href="https://www.instagram.com/totustuus.brand/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@totustuus_brand"
              target="_blank"
              rel="noreferrer"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SiteFooter() {
  return (
    <footer>
      <div className="fi2">
        <div className="ftop">
          <div className="fl">
            <img src="/shopify-assets/LogoCompletoBlanco.png" alt="ToTusTuus" />
          </div>
          <div className="fg">
            <div className="fc">
              <h4>Tienda</h4>
              <ul>
                <li>
                  <Link to="/catalogo?tipo=Sudadera">Sudaderas</Link>
                </li>
                <li>
                  <Link to="/catalogo?tipo=Camiseta">Camisetas</Link>
                </li>
                <li>
                  <Link to="/catalogo?tipo=Polar">Polares</Link>
                </li>
              </ul>
            </div>
            <div className="fc">
              <h4>Soporte</h4>
              <ul>
                <li>
                  <Link to="/contacto">Contacto</Link>
                </li>
              </ul>
            </div>
            <div className="fc">
              <h4>Conócenos...</h4>
              <ul>
                <li>
                  <Link to="/sobre-nosotros">Sobre nosotros</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="fb2">
          <p className="fcp">© 2026 ToTusTuus, Tecnología de Shopify</p>
          <a className="flegal" href="#">
            Términos y políticas
          </a>
          <div className="soc">
            <a
              href="https://www.instagram.com/totustuus.brand/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  ry="5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4.2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@totustuus_brand"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M14.5 4.2c.7 2 2.1 3.3 4.2 3.9v3.1a8 8 0 01-3.7-1v5.5a5.7 5.7 0 11-5.7-5.7c.3 0 .7 0 1 .1v3.2a2.6 2.6 0 102.6 2.6V4.2h1.6z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ProductCard({ product, onQuickAdd }) {
  return (
    <Link className="pc" to={`/producto/${product.id}`}>
      <div className="pci">
        <img src={product.imgs[0]} alt={product.name} loading="lazy" />
        <img
          src={product.imgs[1] || product.imgs[0]}
          alt=""
          className="i2"
          loading="lazy"
        />
      </div>
      <div className="pin">
        <p className="pn">{product.name}</p>
        <p className="pp">{formatPrice(product.price)}</p>
      </div>
      <div className="pact">
        <button
          className="bsz"
          onClick={(event) => {
            event.preventDefault();
            onQuickAdd(product);
          }}
        >
          Elegir talla
        </button>
        <button
          className="badd"
          onClick={(event) => {
            event.preventDefault();
            onQuickAdd(product);
          }}
        >
          Añadir
        </button>
      </div>
    </Link>
  );
}

function HomePage({ onQuickAdd }) {
  return (
    <>
      <div className="top-banner">
        <p className="tb-eye">ToTusTuus · Todo Tuyo, Todo Nuestro, Todo Él</p>
        <h1 className="tb-h">
          Bienvenido a la marca que nace del sí más grande y que quiere
          acompañarte <em>hasta el final</em>.
        </h1>
      </div>
      <div className="hero-grid">
        <Link className="hcol hcol-left" to="/catalogo?tipo=Sudadera">
          <div className="hframe">
            <img
              src="/shopify-collections/Captura_de_pantalla_2025-12-03_131551.png"
              alt="Sudaderas"
            />
          </div>
          <div className="hov">
            <span className="htag">Colección</span>
            <h2 className="hh">Nuestras Sudaderas</h2>
            <span className="bghost">Ver colección</span>
          </div>
        </Link>
        <Link className="hcol hcol-right" to="/catalogo?tipo=Camiseta">
          <div className="hframe">
            <img src="/shopify-collections/22.png" alt="Camisetas" />
          </div>
          <div className="hov">
            <span className="htag">Colección</span>
            <h2 className="hh">Nuestras Camisetas</h2>
            <span className="bghost">Ver colección</span>
          </div>
        </Link>
      </div>
      <div className="feat">
        <div className="fi">
          <div className="fi-frame">
            <img
              src="/shopify-assets/13_e53870c1-a97a-4632-b383-c3026ed1dcd7.png"
              alt="Polar Si Puedes"
            />
          </div>
        </div>
        <div className="fb">
          <span className="ft">Nuevo · Colección Polar</span>
          <h2 className="fh">Polar Si Puedes</h2>
          <p className="fd">
            Polar media cremallera diseñado exclusivamente para ti, para que
            perseveremos en Cristo y nunca perdamos la esperanza en Él.
          </p>
          <Link className="bprim as-link" to="/catalogo?tipo=Polar">
            Explora la colección
          </Link>
        </div>
      </div>
      <div className="sec">
        <div className="shd">
          <h2 className="sh">Nuestros favoritos</h2>
          <Link className="lsm" to="/catalogo">
            Ver todo →
          </Link>
        </div>
        <div className="g3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>
      </div>
      <div className="qs">
        <div className="qi">
          <div>
            <p className="qt">
              "Hacedlo todo de corazón, como para el Señor y no para los
              hombres."
            </p>
            <p className="qr">Colosenses 3:23</p>
          </div>
          <div>
            <p className="qt">"Todo lo puedo en Cristo, que me fortalece."</p>
            <p className="qr">Filipenses 4:13</p>
          </div>
          <div>
            <p className="qt">
              "Pon en manos del Señor todas tus obras, y tus planes se
              cumplirán."
            </p>
            <p className="qr">Proverbios 16:3</p>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}

function CatalogPage({ onQuickAdd }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get("tipo");
  const activeType = categoryOptions.includes(typeParam) ? typeParam : "all";
  const filteredProducts =
    activeType === "all"
      ? products
      : products.filter((product) => product.type === activeType);

  const handleTypeChange = (type) => {
    if (type === "all") {
      setSearchParams({});
      return;
    }
    setSearchParams({ tipo: type });
  };

  return (
    <>
      <div className="pbanner">
        <h1>Catálogo</h1>
      </div>
      <div className="fbar">
        {categoryOptions.map((type) => (
          <button
            key={type}
            className={`fb3 ${activeType === type ? "on" : ""}`}
            onClick={() => handleTypeChange(type)}
          >
            {type === "all" ? "Todo" : `${type}s`}
          </button>
        ))}
      </div>
      <div className="cg">
        <div className="g4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>
      </div>
      <SiteFooter />
    </>
  );
}

function ProductPage({ onAddToCart, onQuickAdd }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((item) => item.id === Number(id));
  const [selectedImage, setSelectedImage] = useState(product?.imgs[0] ?? "");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    if (product) {
      setSelectedImage(product.imgs[0]);
      setSelectedSize("");
    }
  }, [product]);

  if (!product) {
    return (
      <>
        <div className="pp-wrap">
          <span className="pp-back" onClick={() => navigate("/catalogo")}>
            ← Volver al catálogo
          </span>
          <h1 className="pp-name">Producto no encontrado</h1>
        </div>
        <SiteFooter />
      </>
    );
  }

  const related = products.filter((item) => item.id !== product.id).slice(0, 4);

  return (
    <>
      <div className="pp-wrap">
        <span className="pp-back" onClick={() => navigate("/catalogo")}>
          ← Volver al catálogo
        </span>
        <div className="pp-grid">
          <div className="pp-gall">
            <div className="pp-main">
              <img src={selectedImage} alt={product.name} />
            </div>
            <div className="pp-thumbs">
              {product.imgs.map((image) => (
                <button
                  key={image}
                  className={`pp-thumb ${selectedImage === image ? "sel" : ""}`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img src={image} alt={product.name} />
                </button>
              ))}
            </div>
          </div>
          <div className="pp-info">
            <p className="pp-crumb">{product.type}</p>
            <h1 className="pp-name">{product.name}</h1>
            <p className="pp-price">{formatPrice(product.price)}</p>
            <p className="pp-note">
              <em>
                "Para hacer el encargo de cualquier producto contacta con
                nosotros vía Instagram{" "}
                <a
                  href="https://www.instagram.com/totustuus.brand/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--cream2)" }}
                >
                  @totustuus.brand
                </a>
                "
              </em>
            </p>
            <p className="pp-label">Talla</p>
            <div className="pp-sizes">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`psz ${selectedSize === size ? "sel" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="pp-color">Color: {product.color}</p>
            <button
              className="pp-atc"
              onClick={() => onAddToCart(product, selectedSize)}
            >
              Añadir al carrito
            </button>
            <div
              className="pp-desc"
              dangerouslySetInnerHTML={{ __html: product.desc }}
            />
            <div className="pp-guides">
              {product.guides.map((guide, index) => (
                <div
                  key={guide}
                  className={`pp-guide-frame ${index === 0 ? "is-size" : "is-detail"} ${product.type === "Polar" && index === 0 ? "is-polar-size" : ""}`}
                >
                  <img
                    src={guide}
                    alt={
                      index === 0 ? "Guía de tallas" : "Detalles del producto"
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="pp-rel">
          <h3>Te podría interesar...</h3>
          <div className="g4">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}

function AboutPage({ onSubscribe }) {
  const [activeQuote, setActiveQuote] = useState(0);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveQuote((current) => (current + 1) % aboutQuotes.length);
    }, 3800);

    return () => window.clearInterval(interval);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const success = onSubscribe({ email });
    if (success) {
      setEmail("");
    }
  };

  return (
    <>
      <div className="pbanner">
        <h1>Sobre nosotros</h1>
      </div>
      <div className="about-page">
        <section className="about-split">
          <div className="about-media about-media-tight">
            <img src="/shopify-assets/sudadera.png" alt="Sudadera ToTusTuus" />
          </div>
          <div className="about-copy">
            <div className="about-block">
              <h3>Quiénes somos</h3>
              <p>
                ToTusTuus nace del deseo de llevar la fe al día a día de una
                forma cercana, auténtica y actual.
              </p>
              <p>
                No somos solo una marca de ropa: somos un proyecto construido
                con propósito, con mensaje y con la convicción de que Jesús
                puede transformar cada espacio, incluso aquello que vestimos.
              </p>
            </div>
            <div className="about-block">
              <h3>Por qué "ToTusTuus"?</h3>
              <p>
                <strong>Totus Tuus</strong> significa <em>"todo tuyo"</em> en
                latín.
              </p>
              <p>
                Es una expresion de entrega, confianza y misión: ponerlo todo en
                manos de Dios y vivir desde ahí.
              </p>
              <p>
                Cada prenda, diseño y detalle está inspirado en esa entrega
                total.
              </p>
            </div>
          </div>
        </section>

        <section className="about-split about-split-reverse">
          <div className="about-copy">
            <div className="about-block">
              <h3>Nuestra misión</h3>
              <p>Crear ropa que hable sin necesidad de palabras.</p>
              <p>
                Llevar esperanza, luz y fe a traves de diseños que conectan con
                el coraz?n de esta generaci?n.
              </p>
              <p>
                Queremos que quienes vistan ToTusTuus se sientan parte de algo
                más grande: una comunidad que camina, sueña y se entrega{" "}
                <em>
                  <strong>hasta el final</strong>
                </em>
                .
              </p>
              <p>
                Porque creemos que{" "}
                <strong>la fe también se puede vestir</strong>.
              </p>
              <p>Porque hay mensajes que merecen ser llevados con orgullo.</p>
              <p>
                Porque queremos recordarte cada día que{" "}
                <strong>no caminas solo</strong>, que hay esperanza y que{" "}
                <strong>Él te sostiene</strong>.
              </p>
            </div>
          </div>
          <div className="about-media">
            <img
              src="/shopify-assets/525_x_600_px.png"
              alt="Colección ToTusTuus"
            />
          </div>
        </section>

        <section className="about-values">
          <div className="about-section-head">
            <h2>Nuestros valores</h2>
          </div>
          <div className="about-values-grid">
            {aboutValues.map((value) => (
              <article key={value.title} className="about-value-card">
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-quote">
          <div className="about-quote-track">
            <div
              className="about-quote-slider"
              style={{ transform: `translateX(-${activeQuote * 100}%)` }}
            >
              {aboutQuotes.map((quote) => (
                <p key={quote} className="about-quote-item">
                  {quote}
                </p>
              ))}
            </div>
          </div>
          <div className="about-quote-dots" aria-hidden="true">
            {aboutQuotes.map((quote, index) => (
              <span
                key={quote}
                className={`about-dot ${activeQuote === index ? "on" : ""}`}
              />
            ))}
          </div>
        </section>

        <section className="about-identity">
          <div className="about-section-head">
            <h2>ToTusTuus es...</h2>
          </div>
          <div className="about-identity-grid">
            {aboutIdentity.map((item) => (
              <article key={item} className="about-identity-card">
                <span className="about-check" aria-hidden="true">
                  <svg viewBox="0 0 20 20">
                    <path
                      d="M15.4 5.9 8.6 13.3 4.6 9.1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-subscribe">
          <div className="about-section-head">
            <h2>¡No te pierdas ninguna oferta o promoción!</h2>
          </div>
          <p className="about-subscribe-copy">
            Entérate antes que nadie de las nuevas colecciones y ofertas
            especiales.
          </p>
          <form className="about-subscribe-form" onSubmit={handleSubmit}>
            <div className="fg2">
              <label>Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Dirección de correo electrónico"
              />
            </div>
            <button className="bprim" type="submit">
              Suscribirme
            </button>
          </form>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}

function ContactPage({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Consulta sobre pedido",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const success = onSubmit(form);
    if (success) {
      setForm({
        name: "",
        email: "",
        subject: "Consulta sobre pedido",
        message: "",
      });
    }
  };

  return (
    <>
      <div className="pbanner">
        <h1>Contacto</h1>
      </div>
      <div className="cw">
        <h1>Escríbenos</h1>
        <p>
          ¿Tienes alguna duda sobre tu pedido, tallas o cualquier otra consulta?
          Estamos aquí para ayudarte.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="fg2">
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Tu nombre"
            />
          </div>
          <div className="fg2">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
            />
          </div>
          <div className="fg2">
            <label>Asunto</label>
            <select name="subject" value={form.subject} onChange={handleChange}>
              <option>Consulta sobre pedido</option>
              <option>Tallas y medidas</option>
              <option>Devoluciones</option>
              <option>Otro</option>
            </select>
          </div>
          <div className="fg2">
            <label>Mensaje</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Escribe tu mensaje aquí..."
            />
          </div>
          <div style={{ marginTop: "1.4rem" }}>
            <button className="bprim full" type="submit">
              Enviar mensaje
            </button>
          </div>
        </form>
        <p className="contact-note">
          También puedes encontrarnos en <strong>@totustuus.brand</strong>
        </p>
      </div>
      <SiteFooter />
    </>
  );
}

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      setError("");

      try {
        const nextOrders = await fetchAdminOrders();
        setOrders(nextOrders);
      } catch (fetchError) {
        setError(
          fetchError.message ||
            "No se pudieron cargar los pedidos. El acceso lo protege el servidor.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const updatedOrder = await updateAdminOrderStatus(id, status);
      setOrders((current) =>
        current.map((order) => (order.id === id ? updatedOrder : order)),
      );
      setNotice(`Estado actualizado a ${status}`);
      setError("");
    } catch (updateError) {
      setError(updateError.message || "No se pudo actualizar el estado");
    }
  };

  const deleteOrder = async (id) => {
    try {
      await deleteAdminOrder(id);
      setOrders((current) => current.filter((order) => order.id !== id));
      setNotice("Pedido eliminado");
      setError("");
    } catch (deleteError) {
      setError(deleteError.message || "No se pudo eliminar el pedido");
    }
  };

  const resendEmail = async (id) => {
    try {
      const result = await resendAdminOrderEmail(id);
      if (result?.sent) {
        setNotice("Emails reenviados correctamente");
        setError("");
        return;
      }
      setError(
        "SMTP no configurado. El pedido est? guardado, pero no se pudo enviar el correo.",
      );
    } catch (resendError) {
      setError(resendError.message || "No se pudo reenviar el email");
    }
  };

  return (
    <>
      <div className="pbanner">
        <h1>Panel de pedidos</h1>
      </div>
      <div className="admin-wrap">
        {!!error && <p className="admin-error">{error}</p>}
        {!!notice && <p className="contact-note">{notice}</p>}

        {isLoading && (
          <div className="admin-empty">
            <h2>Cargando pedidos</h2>
            <p>Estamos consultando el panel de administraci?n.</p>
          </div>
        )}

        {!isLoading && !orders.length && !error && (
          <div className="admin-empty">
            <h2>No hay pedidos guardados</h2>
            <p>
              Cuando alguien confirme un pedido aparecer? aqu? autom?ticamente.
            </p>
          </div>
        )}

        {!isLoading &&
          orders.map((order) => (
            <article key={order.id} className="admin-card">
              <div className="admin-head">
                <div>
                  <p className="admin-kicker">{order.fecha}</p>
                  <h2>{order.id}</h2>
                </div>
                <div className="admin-actions">
                  <select
                    value={order.estado}
                    onChange={(event) =>
                      updateStatus(order.id, event.target.value)
                    }
                  >
                    <option>Pendiente</option>
                    <option>Preparando</option>
                    <option>Enviado</option>
                    <option>Entregado</option>
                    <option>Cancelado</option>
                  </select>
                  <button
                    className="bprim"
                    type="button"
                    onClick={() => resendEmail(order.id)}
                  >
                    Reenviar emails
                  </button>
                  <button
                    className="bcan"
                    type="button"
                    onClick={() => deleteOrder(order.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              <div className="admin-grid">
                <div className="admin-block">
                  <h3>Cliente</h3>
                  <p>{order.cliente.nombre}</p>
                  <p>{order.cliente.email}</p>
                  <p>{order.cliente.telefono || "-"}</p>
                </div>

                <div className="admin-block">
                  <h3>Env?o</h3>
                  <p>{order.envio.direccion}</p>
                  <p>{order.envio.ciudad}</p>
                  <p>{order.envio.cp}</p>
                </div>

                <div className="admin-block">
                  <h3>Estado</h3>
                  <p>{order.estado}</p>
                  <p>Total: {formatPrice(Number(order.total))}</p>
                  <p>Notas: {order.notas || "-"}</p>
                </div>
              </div>

              <div className="admin-products">
                <h3>Productos</h3>
                {order.productos.map((item, index) => (
                  <div key={`${order.id}-${index}`} className="admin-product-row">
                    <span>{item.nombre}</span>
                    <span>Talla: {item.talla}</span>
                    <span>Cantidad: {item.cantidad}</span>
                    <span>{formatPrice(Number(item.precio))}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
      </div>
      <SiteFooter />
    </>
  );
}

function CartDrawer({
  isOpen,
  cart,
  total,
  onClose,
  onChangeQty,
  onOpenCheckout,
}) {
  return (
    <>
      <div className={`ovl ${isOpen ? "on" : ""}`} onClick={onClose} />
      <div className={`drw ${isOpen ? "on" : ""}`}>
        <div className="dh">
          <h3>Tu carrito</h3>
          <button className="xcl" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="db">
          {!cart.length && (
            <div className="cem">
              <div className="emoji">🛍️</div>
              <div>Tu carrito está vacío</div>
            </div>
          )}
          {!!cart.length &&
            cart.map((item) => (
              <div className="ci" key={item.key}>
                <img src={item.product.imgs[0]} alt={item.product.name} />
                <div>
                  <p className="cin">{item.product.name}</p>
                  <p className="cis">Talla: {item.size}</p>
                  <div className="qr2">
                    <button
                      className="qb"
                      onClick={() => onChangeQty(item.key, -1)}
                    >
                      −
                    </button>
                    <span className="qn">{item.qty}</span>
                    <button
                      className="qb"
                      onClick={() => onChangeQty(item.key, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <span className="cip">
                  €
                  {(item.product.price * item.qty).toFixed(2).replace(".", ",")}
                </span>
              </div>
            ))}
        </div>
        {!!cart.length && (
          <div className="df">
            <div className="ctr">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button className="bco" onClick={onOpenCheckout}>
              Finalizar pedido
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function SizeModal({
  product,
  isOpen,
  selectedSize,
  onSelectSize,
  onClose,
  onConfirm,
}) {
  return (
    <div className={`szb ${isOpen ? "on" : ""}`} onClick={onClose}>
      <div className="szm" onClick={(event) => event.stopPropagation()}>
        <h3>{product?.name || "Producto"}</h3>
        <p>Selecciona una talla</p>
        <div className="szg">
          {["XS", "S", "M", "L", "XL"].map((size) => (
            <button
              key={size}
              className={`sz2 ${selectedSize === size ? "sel" : ""}`}
              onClick={() => onSelectSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
        <div className="sza">
          <button className="bcan" onClick={onClose}>
            Cancelar
          </button>
          <button className="bcon" onClick={onConfirm}>
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckoutModal({ isOpen, cart, total, onClose, onPlaceOrder }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setForm({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        notes: "",
      });
    }
  }, [isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onPlaceOrder(form);
  };

  return (
    <div className={`cob ${isOpen ? "on" : ""}`} onClick={onClose}>
      <div className="cobx" onClick={(event) => event.stopPropagation()}>
        <h2>Finalizar pedido</h2>
        <p className="cosub">
          Rellena tus datos y recibirás confirmación por email.
        </p>
        <div className="cosum">
          <h4>Resumen</h4>
          {cart.map((item) => (
            <div className="coir" key={item.key}>
              <span>
                {item.product.name} ({item.size}) ×{item.qty}
              </span>
              <span>
                €{(item.product.price * item.qty).toFixed(2).replace(".", ",")}
              </span>
            </div>
          ))}
          <hr className="codiv" />
          <div className="cotot">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="fg2">
            <label>Nombre completo</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Tu nombre y apellidos"
            />
          </div>
          <div className="fg2">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
            />
          </div>
          <div className="fg2">
            <label>Teléfono</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+34 600 000 000"
            />
          </div>
          <div className="fg2">
            <label>Dirección de envío</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Calle, número, piso"
            />
          </div>
          <div className="g2col">
            <div className="fg2">
              <label>Ciudad</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Ciudad"
              />
            </div>
            <div className="fg2">
              <label>Código postal</label>
              <input
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="14000"
              />
            </div>
          </div>
          <div className="fg2">
            <label>Notas (opcional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              style={{ minHeight: "65px" }}
              placeholder="Instrucciones especiales..."
            />
          </div>
          <div className="checkout-actions">
            <button className="bcan" type="button" onClick={onClose}>
              Volver
            </button>
            <button className="bcon" type="submit">
              Confirmar pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Toast({ message }) {
  return <div className={`toast ${message ? "on" : ""}`}>{message}</div>;
}

export default function App() {
  const [cart, setCart] = useState(() => {
    const rawCart = localStorage.getItem(storageKeys.cart);
    return rawCart ? JSON.parse(rawCart) : [];
  });
  const [toastMessage, setToastMessage] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickAddProduct, setQuickAddProduct] = useState(null);
  const [quickAddSize, setQuickAddSize] = useState("");

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart],
  );
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.qty, 0),
    [cart],
  );

  useEffect(() => {
    localStorage.setItem(storageKeys.cart, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }
    const timeout = window.setTimeout(() => setToastMessage(""), 2800);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsCartOpen(false);
        setIsCheckoutOpen(false);
        setQuickAddProduct(null);
        setQuickAddSize("");
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const showToast = (message) => setToastMessage(message);

  const addToCart = (product, size) => {
    if (!size) {
      showToast("Por favor selecciona una talla");
      return false;
    }

    const key = `${product.id}-${size}`;
    setCart((current) => {
      const existingItem = current.find((item) => item.key === key);
      if (existingItem) {
        return current.map((item) =>
          item.key === key ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...current, { key, product, size, qty: 1 }];
    });
    showToast(`${product.name} (${size}) añadido`);
    return true;
  };

  const changeQty = (key, delta) => {
    setCart((current) =>
      current.reduce((items, item) => {
        if (item.key !== key) {
          items.push(item);
          return items;
        }
        const nextQty = item.qty + delta;
        if (nextQty > 0) {
          items.push({ ...item, qty: nextQty });
        }
        return items;
      }, []),
    );
  };

  const submitContact = (form) => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      showToast("Por favor rellena todos los campos");
      return false;
    }
    showToast("¡Mensaje enviado! Te respondemos pronto.");
    return true;
  };

  const submitSubscription = (form) => {
    if (!form.email.trim()) {
      showToast("Por favor introduce tu correo electrónico");
      return false;
    }

    showToast("¡Suscripcion realizada correctamente!");
    return true;
  };

  const placeOrder = async (form) => {
    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.postalCode.trim()
    ) {
      showToast("Rellena todos los campos obligatorios");
      return false;
    }

    if (!cart.length) {
      showToast("Tu carrito est? vac?o");
      return false;
    }

    try {
      const response = await createOrderRequest({
        ...form,
        items: cart,
      });

      setCart([]);
      setIsCheckoutOpen(false);

      if (response?.emailResult?.sent) {
        showToast("Pedido realizado. Hemos enviado la confirmaci?n por email.");
      } else {
        showToast(
          "Pedido realizado. Lo hemos registrado, pero el email autom?tico no est? configurado todav?a.",
        );
      }

      return true;
    } catch (orderError) {
      showToast(orderError.message || "No se pudo finalizar el pedido");
      return false;
    }
  };

  const openQuickAdd = (product) => {
    setQuickAddProduct(product);
    setQuickAddSize("");
  };

  const confirmQuickAdd = () => {
    if (!quickAddProduct) {
      return;
    }
    const success = addToCart(quickAddProduct, quickAddSize);
    if (success) {
      setQuickAddProduct(null);
      setQuickAddSize("");
    }
  };

  return (
    <div className="app-shell">
      <Header cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />
      <Routes>
        <Route path="/" element={<HomePage onQuickAdd={openQuickAdd} />} />
        <Route
          path="/catalogo"
          element={<CatalogPage onQuickAdd={openQuickAdd} />}
        />
        <Route
          path="/producto/:id"
          element={
            <ProductPage onAddToCart={addToCart} onQuickAdd={openQuickAdd} />
          }
        />
        <Route
          path="/sobre-nosotros"
          element={<AboutPage onSubscribe={submitSubscription} />}
        />
        <Route path="/admin-pedidos" element={<AdminOrdersPage />} />
        <Route
          path="/contacto"
          element={<ContactPage onSubmit={submitContact} />}
        />
      </Routes>
      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        total={cartTotal}
        onClose={() => setIsCartOpen(false)}
        onChangeQty={changeQty}
        onOpenCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />
      <SizeModal
        product={quickAddProduct}
        isOpen={Boolean(quickAddProduct)}
        selectedSize={quickAddSize}
        onSelectSize={setQuickAddSize}
        onClose={() => {
          setQuickAddProduct(null);
          setQuickAddSize("");
        }}
        onConfirm={confirmQuickAdd}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        cart={cart}
        total={cartTotal}
        onClose={() => setIsCheckoutOpen(false)}
        onPlaceOrder={placeOrder}
      />
      <Toast message={toastMessage} />
    </div>
  );
}
