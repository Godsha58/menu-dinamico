export type MenuSectionId = "entradas" | "plato-fuerte";

export type MenuProduct = {
  id: string;
  sectionId: MenuSectionId;
  name: string;
  description: string;
  price: number;
  imageKey: "guacamole" | "ensalada" | "hamburguesa" | "enchiladas";
};

export type MenuSection = {
  id: MenuSectionId;
  title: string;
};

export const menuSections: MenuSection[] = [
  { id: "entradas", title: "Entradas" },
  { id: "plato-fuerte", title: "Plato Fuerte" },
];

export const menuProducts: MenuProduct[] = [
  {
    id: "guacamole",
    sectionId: "entradas",
    name: "Guacamole",
    description: "Aguacate, jitomate y limón.",
    price: 79,
    imageKey: "guacamole",
  },
  {
    id: "ensalada",
    sectionId: "entradas",
    name: "Ensalada",
    description: "Lechuga, tomate y aderezo.",
    price: 189,
    imageKey: "ensalada",
  },
  {
    id: "hamburguesa",
    sectionId: "plato-fuerte",
    name: "Hamburguesa",
    description: "Res, queso y pan tostado.",
    price: 149,
    imageKey: "hamburguesa",
  },
  {
    id: "enchiladas",
    sectionId: "plato-fuerte",
    name: "Enchiladas",
    description: "Salsa roja, pollo y crema.",
    price: 139,
    imageKey: "enchiladas",
  },
];

export const menuBySection = menuSections.map((section) => ({
  section,
  products: menuProducts.filter((p) => p.sectionId === section.id),
}));

