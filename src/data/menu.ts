export type MenuSectionId = "bolas" | "extras";

export type MenuProduct = {
  id: string;
  sectionId: MenuSectionId;
  name: string;
  description: string;
  price: number;
  imageKey:
    | "bola-pollo"
    | "bola-camaron"
    | "bola-res"
    | "papas"
    | "aros"
    | "refresco";
  /** Solo bolas: el usuario elige con o sin verdura al añadir. */
  requiresVegetableOption?: boolean;
};

export type MenuSection = {
  id: MenuSectionId;
  /** Título visible en el listado del menú */
  title: string;
  /** Etiqueta en la barra de categorías (puede ser más corta) */
  navLabel: string;
};

export const menuSections: MenuSection[] = [
  { id: "bolas", title: "BOLAS DE ARROZ", navLabel: "BOLAS DE ARROZ" },
  { id: "extras", title: "EXTRAS Y BEBIDAS", navLabel: "EXTRAS" },
];

export const menuProducts: MenuProduct[] = [
  {
    id: "bola-pollo",
    sectionId: "bolas",
    name: "Bola de Pollo",
    description: "Arroz, pollo y salsa.",
    price: 99,
    imageKey: "bola-pollo",
    requiresVegetableOption: true,
  },
  {
    id: "bola-camaron",
    sectionId: "bolas",
    name: "Bola de Camarón",
    description: "Arroz, camarón y salsa.",
    price: 119,
    imageKey: "bola-camaron",
    requiresVegetableOption: true,
  },
  {
    id: "bola-res",
    sectionId: "bolas",
    name: "Bola de Res",
    description: "Arroz, res y salsa.",
    price: 109,
    imageKey: "bola-res",
    requiresVegetableOption: true,
  },
  {
    id: "papas",
    sectionId: "extras",
    name: "Papas a la francesa",
    description: "Crujientes y doradas.",
    price: 45,
    imageKey: "papas",
  },
  {
    id: "aros-cebolla",
    sectionId: "extras",
    name: "Aros de Cebolla",
    description: "Empanizados.",
    price: 39,
    imageKey: "aros",
  },
  {
    id: "refresco",
    sectionId: "extras",
    name: "Refresco",
    description: "Bebida fría.",
    price: 30,
    imageKey: "refresco",
  },
];

export const menuBySection = menuSections.map((section) => ({
  section,
  products: menuProducts.filter((p) => p.sectionId === section.id),
}));
