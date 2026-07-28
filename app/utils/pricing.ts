export const products: {
  [key: string]: { price: number; width: number; height: number };
} = {
  Small: { price: 8900, width: 8, height: 12 },
  Medium: { price: 9900, width: 12, height: 16 },
  Large: { price: 10900, width: 16, height: 24 },
  XL: { price: 19900, width: 30, height: 40 },
  Digital: { price: 5900, width: 0, height: 0 },
};

export const sale: { name: string; discount: number } = {
  name: "Launch Sale",
  discount: 60,
};
