export interface Product {
  id: string;
  name: string;
  category: string;
  badge?: string;
  description: string;
  priceCRC: number;
  unit: string;
  isHero: boolean;
  inStock: boolean;
}

export const CATEGORIES = [
  "Línea Diaria",
  "Tradición Tica",
  "Reserva & Sabor",
  "Derivados de Rancho",
  "Combos & Mayoristas",
];

export const products: Product[] = [
  {
    id: "semiduro-tradicional",
    name: "Semiduro Tradicional",
    category: "Línea Diaria",
    badge: "Más Vendido",
    description: "El favorito de la feria. Perfecto punto de sal, ideal para derretir o comer con pan. Hecho con receta familiar de hace 30 años.",
    priceCRC: 5500,
    unit: "kg",
    isHero: true,
    inStock: true,
  },
  {
    id: "turrialba-artesanal",
    name: "Turrialba Artesanal",
    category: "Línea Diaria",
    description: "Fresco, suave y esponjoso. El clásico costarricense indispensable en su mesa para el gallo pinto.",
    priceCRC: 4800,
    unit: "kg",
    isHero: false,
    inStock: true,
  },
  {
    id: "queso-tierno",
    name: "Queso Tierno Bajo en Sal",
    category: "Línea Diaria",
    description: "Ligero y saludable, manteniendo la frescura del campo sin excesos de sodio.",
    priceCRC: 4600,
    unit: "kg",
    isHero: false,
    inStock: true,
  },
  {
    id: "queso-palmito",
    name: "Queso Palmito Hilado a Mano",
    category: "Tradición Tica",
    description: "Hilado a mano, fresco y delicioso. Un snack perfecto para los más pequeños.",
    priceCRC: 3500,
    unit: "und",
    isHero: false,
    inStock: true,
  },
  {
    id: "queso-bagaces",
    name: "Queso Bagaces Seco Salado",
    category: "Tradición Tica",
    description: "El toque seco y saladito, especial para rallar sobre plátanos maduros o frijoles molidos.",
    priceCRC: 5800,
    unit: "kg",
    isHero: false,
    inStock: true,
  },
  {
    id: "cuajada-criolla",
    name: "Cuajada Criolla",
    category: "Tradición Tica",
    description: "Sabor del campo, perfecta compañera para tortilla palmeada recién hecha.",
    priceCRC: 2400,
    unit: "und",
    isHero: false,
    inStock: true,
  },
  {
    id: "maduro-reserva",
    name: "Queso Maduro Reserva",
    category: "Reserva & Sabor",
    badge: "Gourmet",
    description: "Añejado artesanalmente, sabor intenso perfecto para tablas de quesos y vino.",
    priceCRC: 6800,
    unit: "kg",
    isHero: false,
    inStock: true,
  },
  {
    id: "ahumado-lena",
    name: "Queso Ahumado en Leña",
    category: "Reserva & Sabor",
    description: "Ahumado lentamente con leña natural para un sabor campestre inigualable.",
    priceCRC: 6200,
    unit: "kg",
    isHero: false,
    inStock: true,
  },
  {
    id: "natilla-casera",
    name: "Natilla Casera de Rancho",
    category: "Derivados de Rancho",
    description: "Cremosa, fresca y sin preservantes artificiales. Como la hacía la abuela.",
    priceCRC: 2200,
    unit: "500g",
    isHero: false,
    inStock: true,
  },
  {
    id: "mantequilla-lavada",
    name: "Mantequilla Lavada Artesanal",
    category: "Derivados de Rancho",
    description: "Pura mantequilla lavada a mano, sabor rústico inconfundible.",
    priceCRC: 1900,
    unit: "und",
    isHero: false,
    inStock: true,
  },
  {
    id: "combo-feria",
    name: "Combo Feria Tradicional",
    category: "Combos & Mayoristas",
    badge: "Ahorro",
    description: "1 kg de Semiduro + 1 Natilla + Pan casero. Ideal para la semana.",
    priceCRC: 8500,
    unit: "pack",
    isHero: false,
    inStock: true,
  },
  {
    id: "tabla-degustacion",
    name: "Tabla Degustación Doña Martha",
    category: "Combos & Mayoristas",
    description: "Selección de nuestros mejores quesos (Semiduro, Ahumado, Maduro y Palmito) lista para servir.",
    priceCRC: 11500,
    unit: "pack",
    isHero: false,
    inStock: true,
  },
  {
    id: "bloque-b2b",
    name: "Bloque B2B Restaurantes 2.5kg",
    category: "Combos & Mayoristas",
    badge: "Solo Mayoristas",
    description: "Bloque de Semiduro especial para sodas y restaurantes. Funde perfecto.",
    priceCRC: 12000,
    unit: "bloque",
    isHero: false,
    inStock: true,
  }
];
