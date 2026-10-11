export interface Product {
  id: string;
  name: string;
  category: string;
  badge?: string;
  description: string;
  presentation: string;
  priceCRC: number;
  unit: string;
  isHero: boolean;
  inStock: boolean;
  image: string;
  tagColor?: string;
}

export const USD_EXCHANGE_RATE = 520; // Tipo de cambio referencial CRC / USD

export const CATEGORIES = [
  "Línea Tradicional Turrialba",
  "Quesos de Mesa & Hilados",
  "Madurados & Ahumados",
  "Derivados Lácteos del Rancho",
  "Especial Mayoristas & Sodas",
];

export const products: Product[] = [
  {
    id: "semiduro-tradicional",
    name: "Queso Semiduro de Turrialba",
    category: "Línea Tradicional Turrialba",
    badge: "Insignia de la Casa",
    description: "Nuestro producto insignia desde 1980. Traído semanalmente de productores de Turrialba. Punto exacto de sal, textura firme que dora y gratina a la perfección.",
    presentation: "Pieza al vacío por peso",
    priceCRC: 5500,
    unit: "kg",
    isHero: true,
    inStock: true,
    image: "/hero_queso.jpg",
    tagColor: "#B85D38"
  },
  {
    id: "turrialba-artesanal",
    name: "Queso Turrialba Fresco de Finca",
    category: "Línea Tradicional Turrialba",
    badge: "Ordeño Fresco",
    description: "Fresco, esponjoso y con el inconfundible toque lácteo tradicional. El acompañamiento sagrado para el gallo pinto y tortillas palmeadas.",
    presentation: "Bloque fresco o porción",
    priceCRC: 4800,
    unit: "kg",
    isHero: false,
    inStock: true,
    image: "/queso_catalogo.jpg",
    tagColor: "#2E5D43"
  },
  {
    id: "queso-tierno",
    name: "Queso Tierno Bajo en Sal",
    category: "Línea Tradicional Turrialba",
    description: "Elaborado especialmente para quienes cuidan su consumo de sodio sin renunciar a la humedad y el sabor de la leche pura de campo.",
    presentation: "Cuña empacada",
    priceCRC: 4600,
    unit: "kg",
    isHero: false,
    inStock: true,
    image: "/queso_catalogo.jpg",
    tagColor: "#3B7A57"
  },
  {
    id: "queso-palmito",
    name: "Queso Palmito Hilado a Mano",
    category: "Quesos de Mesa & Hilados",
    badge: "Elaboración Manual",
    description: "Hilado artesanalmente capa por capa. Suave, elástico y con el nivel justo de acidez y salmuera tradicional costarricense.",
    presentation: "Rollo individual sellado",
    priceCRC: 3500,
    unit: "und (aprox. 500g)",
    isHero: false,
    inStock: true,
    image: "/historia_queso.jpg",
    tagColor: "#C28535"
  },
  {
    id: "queso-bagaces",
    name: "Queso Bagaces Maduro Seco",
    category: "Quesos de Mesa & Hilados",
    description: "Queso seco de pasta prensada y madurada. Sabor intenso y salado, ideal para rallar sobre plátanos maduros con natilla y frijoles.",
    presentation: "Bloque seco para rallar",
    priceCRC: 5800,
    unit: "kg",
    isHero: false,
    inStock: true,
    image: "/hero_queso.jpg",
    tagColor: "#9A6233"
  },
  {
    id: "cuajada-criolla",
    name: "Cuajada Criolla Tradicional",
    category: "Quesos de Mesa & Hilados",
    description: "Receta campesina de cuajado natural suave. Su textura rústica y jugo lácteo fresco evocan el desayuno en la montaña.",
    presentation: "Bola artesanal",
    priceCRC: 2400,
    unit: "und",
    isHero: false,
    inStock: true,
    image: "/queso_catalogo.jpg",
    tagColor: "#5B7065"
  },
  {
    id: "maduro-reserva",
    name: "Queso Maduro Selección Especial",
    category: "Madurados & Ahumados",
    badge: "Oreado Lento",
    description: "Semiduro seleccionado con tiempo extra de oreado natural. Desarrolla notas a frutos secos y corteza dorada firme para tablas.",
    presentation: "Cuña madurada al corte",
    priceCRC: 6800,
    unit: "kg",
    isHero: false,
    inStock: true,
    image: "/hero_queso.jpg",
    tagColor: "#8D4925"
  },
  {
    id: "ahumado-lena",
    name: "Queso Ahumado en Leña Natural",
    category: "Madurados & Ahumados",
    description: "Ahumado paciente en humo de maderas nobles seleccionadas. Aroma profundo de campo que complementa panes campesinos.",
    presentation: "Rueda o media rueda",
    priceCRC: 6200,
    unit: "kg",
    isHero: false,
    inStock: true,
    image: "/hero_queso.jpg",
    tagColor: "#6B3E26"
  },
  {
    id: "natilla-casera",
    name: "Natilla Casera de Rancho",
    category: "Derivados Lácteos del Rancho",
    badge: "100% Pura Crema",
    description: "Natilla espesa de verdad, obtenida por descremado natural. Sin almidones ni espesantes artificiales.",
    presentation: "Envase de 500g",
    priceCRC: 2200,
    unit: "500g",
    isHero: false,
    inStock: true,
    image: "/queso_catalogo.jpg",
    tagColor: "#4B6B58"
  },
  {
    id: "mantequilla-lavada",
    name: "Mantequilla Lavada Artesanal",
    category: "Derivados Lácteos del Rancho",
    description: "Batida y lavada a mano como en las lecherías de antaño. Color crema y aroma limpio a suero de leche.",
    presentation: "Barra rústica 250g",
    priceCRC: 1900,
    unit: "und",
    isHero: false,
    inStock: true,
    image: "/queso_catalogo.jpg",
    tagColor: "#B5943B"
  },
  {
    id: "combo-familiar",
    name: "Surtido Semanal Familiar",
    category: "Especial Mayoristas & Sodas",
    badge: "Ahorro",
    description: "1 kg de Semiduro de Turrialba + 1 Palmito hilado + 1 Natilla de rancho (500g). Lo esencial para la semana.",
    presentation: "Paquete completo",
    priceCRC: 10500,
    unit: "pack",
    isHero: false,
    inStock: true,
    image: "/queso_catalogo.jpg",
    tagColor: "#B85D38"
  },
  {
    id: "bloque-b2b-semiduro",
    name: "Bloque Semiduro Institucional (2.5 kg)",
    category: "Especial Mayoristas & Sodas",
    badge: "Canal Sodas & Restaurantes",
    description: "Formato en bloque prensado de 2.5 kg para cocinas comerciales, pizzerías y sodas. Excelente rendimiento en rallado y gratinado.",
    presentation: "Bloque al vacío 2.5 kg",
    priceCRC: 12500,
    unit: "bloque 2.5kg",
    isHero: false,
    inStock: true,
    image: "/hero_queso.jpg",
    tagColor: "#1B3A2B"
  }
];
