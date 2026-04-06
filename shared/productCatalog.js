export const productCatalog = [
  {
    id: 1,
    name: 'Camiseta "Encendidos"',
    price: 22,
    type: "Camiseta",
    image: "15.png",
  },
  {
    id: 2,
    name: "Camiseta Sonrisa",
    price: 22,
    type: "Camiseta",
    image: "20.png",
  },
  {
    id: 3,
    name: "Camiseta Tres en Raya",
    price: 22,
    type: "Camiseta",
    image: "13_48058a1d-c72f-4d51-80e0-144312733223.png",
  },
  {
    id: 4,
    name: "Polar Media Cremallera Si Puedes",
    price: 35,
    type: "Polar",
    image: "11_173b46a5-59ec-46db-9164-5e4625b59553.png",
  },
  {
    id: 5,
    name: "Sudadera Confía",
    price: 28,
    type: "Sudadera",
    image: "6.png",
  },
  {
    id: 6,
    name: "Sudadera Sin Miedo Te Espero",
    price: 30,
    type: "Sudadera",
    image: "2.png",
  },
];

export const productCatalogById = new Map(
  productCatalog.map((product) => [product.id, product]),
);

export const allowedSizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "4XL",
  "5XL",
];
