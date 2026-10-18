export interface SensoryProfile {
  firmeza: number; // 1 to 5
  salinidad: number; // 1 to 5
  fundicion: number; // 1 to 5
  intensidad: number; // 1 to 5
}

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
  idealUses: string[];
  pairingNote: string;
  sensory: SensoryProfile;
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
    description:
      "Nuestro producto insignia desde 1980. Traído semanalmente de productores de Turrialba. Punto exacto de sal, textura firme que dora al sartén sin deshacerse y gratina con carácter.",
    presentation: "Pieza al vacío por peso",
    priceCRC: 5500,
    unit: "kg",
    isHero: true,
    inStock: true,
    image: "/hero_luxury_maison.jpg",
    tagColor: "#B85D38",
    idealUses: ["Asar al sartén", "Gallo pinto", "Rallar y gratinar"],
    pairingNote: "Ideal en tajadas gruesas a la plancha junto a café recién chorreado y plátano maduro.",
    sensory: { firmeza: 4, salinidad: 3, fundicion: 4, intensidad: 4 },
  },
  {
    id: "turrialba-artesanal",
    name: "Queso Turrialba Fresco de Finca",
    category: "Línea Tradicional Turrialba",
    badge: "Ordeño Fresco",
    description:
      "Fresco, esponjoso y con el inconfundible toque lácteo de montaña. El acompañamiento sagrado para el desayuno tico y tortillas recién palmeadas.",
    presentation: "Bloque fresco o porción",
    priceCRC: 4800,
    unit: "kg",
    isHero: false,
    inStock: true,
    image: "/queso_catalogo.jpg",
    tagColor: "#2E5D43",
    idealUses: ["Mesa y desayuno", "Tortillas palmeadas", "Ensaladas frescas"],
    pairingNote: "Combina de maravilla con miel de abeja, mermelada de guayaba o aguacate fresco.",
    sensory: { firmeza: 2, salinidad: 2, fundicion: 3, intensidad: 2 },
  },
  {
    id: "queso-tierno",
    name: "Queso Tierno Bajo en Sal",
    category: "Línea Tradicional Turrialba",
    badge: "Salud & Ligereza",
    description:
      "Elaborado especialmente para quienes cuidan su consumo de sodio sin renunciar a la humedad, suavidad y pureza de la leche recién ordeñada.",
    presentation: "Cuña empacada",
    priceCRC: 4600,
    unit: "kg",
    isHero: false,
    inStock: true,
    image: "/queso_catalogo.jpg",
    tagColor: "#3B7A57",
    idealUses: ["Dieta baja en sodio", "Meriendas ligeras", "Sándwiches suaves"],
    pairingNote: "Suave y lácteo; perfecto con pan integral artesanal, tomate cherry y albahaca.",
    sensory: { firmeza: 2, salinidad: 1, fundicion: 3, intensidad: 2 },
  },
  {
    id: "queso-palmito",
    name: "Queso Palmito Hilado a Mano",
    category: "Quesos de Mesa & Hilados",
    badge: "Elaboración Manual",
    description:
      "Hilado artesanalmente capa por capa. Suave, elástico y jugoso, con el nivel justo de acidez láctea y salmuera tradicional costarricense.",
    presentation: "Rollo individual sellado",
    priceCRC: 3500,
    unit: "und (aprox. 500g)",
    isHero: false,
    inStock: true,
    image: "/queso_palmito.jpg",
    tagColor: "#C28535",
    idealUses: ["Deshebrar en mesa", "Pizzas y pastas", "Prensadas y empanadas"],
    pairingNote: "Funde formando hilos largos y elásticos; extraordinario en chorreadas de maíz dulce.",
    sensory: { firmeza: 3, salinidad: 2, fundicion: 5, intensidad: 3 },
  },
  {
    id: "queso-bagaces",
    name: "Queso Bagaces Maduro Seco",
    category: "Quesos de Mesa & Hilados",
    description:
      "Queso seco de pasta prensada y madurada al estilo guanacasteco. Sabor intenso y salado, ideal para rallar fino sobre frijoles y maduros.",
    presentation: "Bloque seco para rallar",
    priceCRC: 5800,
    unit: "kg",
    isHero: false,
    inStock: true,
    image: "/queso_ahumado.jpg",
    tagColor: "#9A6233",
    idealUses: ["Rallar fino", "Plátanos maduros", "Sopas y cremas"],
    pairingNote: "El toque umami costarricense: rállelo sobre plátano maduro horneado con natilla de rancho.",
    sensory: { firmeza: 5, salinidad: 5, fundicion: 2, intensidad: 5 },
  },
  {
    id: "cuajada-criolla",
    name: "Cuajada Criolla Tradicional",
    category: "Quesos de Mesa & Hilados",
    description:
      "Receta campesina de cuajado natural suave. Su textura granulada rústica y suero fresco evocan el desayuno tradicional en la montaña.",
    presentation: "Bola artesanal",
    priceCRC: 2400,
    unit: "und",
    isHero: false,
    inStock: true,
    image: "/queso_catalogo.jpg",
    tagColor: "#5B7065",
    idealUses: ["Tortilla recién hecha", "Gallo pinto mañanero", "Horneados caseros"],
    pairingNote: "Disfrútela a temperatura ambiente sobre una tortilla caliente recién salida del comal.",
    sensory: { firmeza: 2, salinidad: 3, fundicion: 1, intensidad: 3 },
  },
  {
    id: "maduro-reserva",
    name: "Queso Maduro Selección Especial",
    category: "Madurados & Ahumados",
    badge: "Oreado Lento",
    description:
      "Semiduro seleccionado con tiempo extra de oreado natural en penumbra. Desarrolla notas a mantequilla tostada, frutos secos y corteza dorada firme.",
    presentation: "Cuña madurada al corte",
    priceCRC: 6800,
    unit: "kg",
    isHero: false,
    inStock: true,
    image: "/queso_ahumado.jpg",
    tagColor: "#8D4925",
    idealUses: ["Tablas de picada", "Maridaje con vino", "Gratinado gourmet"],
    pairingNote: "Corte en cubos o láminas delgadas junto a frutos secos, uvas y vino tinto o cerveza artesanal.",
    sensory: { firmeza: 5, salinidad: 3, fundicion: 4, intensidad: 5 },
  },
  {
    id: "ahumado-lena",
    name: "Queso Ahumado en Leña Natural",
    category: "Madurados & Ahumados",
    badge: "Receta de Campo",
    description:
      "Ahumado pacientemente con humo de maderas nobles seleccionadas. Aroma profundo de fogón campesino que transforma cualquier bocadillo.",
    presentation: "Rueda o media rueda",
    priceCRC: 6200,
    unit: "kg",
    isHero: false,
    inStock: true,
    image: "/queso_ahumado.jpg",
    tagColor: "#6B3E26",
    idealUses: ["Tablas y picadas", "Hamburguesas y sándwiches", "Asado a la parrilla"],
    pairingNote: "Increíble ligeramente tibio sobre pan campesino tostado o derretido en carnes al grill.",
    sensory: { firmeza: 4, salinidad: 3, fundicion: 4, intensidad: 5 },
  },
  {
    id: "natilla-casera",
    name: "Natilla Casera de Rancho",
    category: "Derivados Lácteos del Rancho",
    badge: "100% Pura Crema",
    description:
      "Natilla espesa de verdad, obtenida por descremado natural con punto sutil de sal. Sin almidones, féculas ni espesantes artificiales.",
    presentation: "Envase de 500g",
    priceCRC: 2200,
    unit: "500g",
    isHero: false,
    inStock: true,
    image: "/natilla_mantequilla.jpg",
    tagColor: "#4B6B58",
    idealUses: ["Gallo pinto y plátanos", "Tortillas y bizcochos", "Salsas cremosas"],
    pairingNote: "Textura densa que sostiene la cuchara; el alma indiscutible del desayuno costarricense.",
    sensory: { firmeza: 1, salinidad: 2, fundicion: 5, intensidad: 4 },
  },
  {
    id: "mantequilla-lavada",
    name: "Mantequilla Lavada Artesanal",
    category: "Derivados Lácteos del Rancho",
    description:
      "Batida y lavada a mano en agua fría de montaña como en las lecherías de antaño. Color dorado natural y aroma limpio.",
    presentation: "Barra rústica 250g",
    priceCRC: 1900,
    unit: "und (250g)",
    isHero: false,
    inStock: true,
    image: "/natilla_mantequilla.jpg",
    tagColor: "#B5943B",
    idealUses: ["Pan caliente y tostadas", "Repostería casera", "Dorar quesos y carnes"],
    pairingNote: "Derrítala sobre pan casero caliente o úsela para dorar una tajada de Semiduro al sartén.",
    sensory: { firmeza: 2, salinidad: 2, fundicion: 5, intensidad: 4 },
  },
  {
    id: "combo-familiar",
    name: "Surtido Semanal Familiar",
    category: "Especial Mayoristas & Sodas",
    badge: "Favorito de Feria",
    description:
      "1 kg de Semiduro de Turrialba + 1 Queso Palmito hilado (500g) + 1 Natilla de rancho (500g). El paquete completo para los desayunos y cenas de toda la semana.",
    presentation: "Canasta completa (2 kg total)",
    priceCRC: 10500,
    unit: "pack",
    isHero: false,
    inStock: true,
    image: "/combo_feria.jpg",
    tagColor: "#B85D38",
    idealUses: ["Abasto familiar semanal", "Desayunos y cenas", "Ahorro directo"],
    pairingNote: "Ahorra ₡700 respecto a la compra individual y resuelve toda la semana en un solo clic.",
    sensory: { firmeza: 4, salinidad: 3, fundicion: 4, intensidad: 4 },
  },
  {
    id: "bloque-b2b-semiduro",
    name: "Bloque Semiduro Institucional (2.5 kg)",
    category: "Especial Mayoristas & Sodas",
    badge: "Canal Sodas & Restaurantes",
    description:
      "Formato en bloque prensado de 2.5 kg para cocinas comerciales, pizzerías, panaderías y sodas. Rendimiento superior en rallado, plancha y gratinado.",
    presentation: "Bloque al vacío 2.5 kg",
    priceCRC: 12500,
    unit: "bloque 2.5kg",
    isHero: false,
    inStock: true,
    image: "/hero_queso.jpg",
    tagColor: "#1B3A2B",
    idealUses: ["Cocinas comerciales", "Empanadas y pizzerías", "Alto rendimiento"],
    pairingNote: "Equivale a ₡5,000/kg por volumen. Punto de sal y humedad estandarizados para cocina.",
    sensory: { firmeza: 4, salinidad: 3, fundicion: 4, intensidad: 4 },
  },
];
