import { useEffect, useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import "./App.css";

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vThMZJyTh5w6YcGEyKyMjn0Mka2J5JsBPtcFXh_T37OODLVQ9ghynpMzxtNm_f7gC6DvflSiinMMvP8/pub?gid=0&single=true&output=csv";

const WHATSAPP_NUMBER = "50670182943";

function parseCSV(text) {
  const rows = text.trim().split(/\r?\n/);

  const headers = rows[0]
    .split(",")
    .map((h) => h.trim());

  return rows.slice(1).map((row) => {
    const values = row
      .split(",")
      .map((v) => v.trim());

    return headers.reduce((obj, header, index) => {
      obj[header] = values[index] || "";
      return obj;
    }, {});
  });
}

function Catalogo({ productos }) {
  const crearLinkWhatsApp = (producto) => {
    const urlProducto = `${window.location.origin}/producto/${producto.codigo_item}`;

    const mensaje = `Hola, quiero información de este producto:

${producto.nombre}
${producto.descripcion}
Precio: ${producto.precio}

Link: ${urlProducto}`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      mensaje
    )}`;
  };

  return (
    <div className="page">
      <header className="hero">
        <img
          src="/logo-bloom.jpeg"
          alt="Bloom by Karina"
          className="logo"
        />
      </header>

      <main className="content">
        <section className="title-section">
          <h1>Catálogo</h1>
          <p>Productos disponibles</p>
        </section>

        <section className="grid">
          {productos.map((producto) => (
            <article
              className="card"
              key={producto.codigo_item}
            >
              <Link
                to={`/producto/${producto.codigo_item}`}
              >
                <img
                  className="product-image"
                  src={producto.imagen_url}
                  alt={producto.nombre}
                />
              </Link>

              <h2>{producto.nombre}</h2>

              <p>{producto.descripcion}</p>

              <strong>{producto.precio}</strong>

              <a
                href={crearLinkWhatsApp(producto)}
                target="_blank"
                rel="noreferrer"
              >
                Consultar por WhatsApp
              </a>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

function ProductoDetalle({ productos }) {
  const { id } = useParams();

  const producto = productos.find(
    (p) => p.codigo_item === id
  );

  if (!producto) {
    return <h1>Producto no encontrado</h1>;
  }

  const mensaje = `Hola, quiero información de este producto:

${producto.nombre}
${producto.descripcion}
Precio: ${producto.precio}

Link: ${window.location.href}`;

  return (
    <div className="detalle-page">
      <div className="detalle-card">
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          className="detalle-imagen"
        />

        <div className="detalle-info">
          <h1>{producto.nombre}</h1>

          <p>{producto.descripcion}</p>

          <strong>{producto.precio}</strong>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              mensaje
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            Consultar por WhatsApp
          </a>

          <Link to="/" className="volver">
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch(SHEET_CSV_URL)
      .then((res) => res.text())
      .then((text) => {
        const data = parseCSV(text);

        const disponibles = data.filter(
          (p) =>
            (p.estado || "").toLowerCase() !==
            "agotado"
        );

        setProductos(disponibles);
      })
      .catch((err) =>
        console.error(
          "Error cargando catálogo:",
          err
        )
      );
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={<Catalogo productos={productos} />}
      />

      <Route
        path="/producto/:id"
        element={
          <ProductoDetalle productos={productos} />
        }
      />
    </Routes>
  );
}

function App() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch(SHEET_CSV_URL)
      .then((res) => res.text())
      .then((text) => {
        const data = parseCSV(text);

        const disponibles = data.filter(
          (p) => (p.estado || "").toLowerCase() !== "agotado"
        );

        setProductos(disponibles);
      })
      .catch((err) => console.error("Error cargando catálogo:", err));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Catalogo productos={productos} />} />
      <Route path="/producto/:id" element={<ProductoDetalle productos={productos} />} />
    </Routes>
  );
}

export default App;
