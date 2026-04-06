export const productCatalog = [
  { id: 1, name: 'Camiseta "Encendidos"', price: 22, type: "Camiseta" },
  { id: 2, name: "Camiseta Sonrisa", price: 22, type: "Camiseta" },
  { id: 3, name: "Camiseta Tres en Raya", price: 22, type: "Camiseta" },
  {
    id: 4,
    name: "Polar Media Cremallera Si Puedes",
    price: 35,
    type: "Polar",
  },
  { id: 5, name: "Sudadera Confía", price: 28, type: "Sudadera" },
  { id: 6, name: "Sudadera Sin Miedo Te Espero", price: 30, type: "Sudadera" },
];

export const productCatalogById = new Map(
  productCatalog.map((product) => [product.id, product]),
);

export const allowedSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
