export const storeCurrency = "USD";

export const printSizes = ["Small", "Medium", "Large", "XL"] as const;

export const products = {
  Small: { label: "A4", price: 5900, widthMm: 210, heightMm: 297 },
  Medium: { label: "A3", price: 6900, widthMm: 297, heightMm: 420 },
  Large: { label: "A2", price: 8900, widthMm: 420, heightMm: 594 },
  XL: { label: "A1", price: 16900, widthMm: 594, heightMm: 841 },
  Digital: { label: "Digital", price: 2900 },
} as const;

export type ProductSize = keyof typeof products;

export function isProductSize(value: unknown): value is ProductSize {
  return typeof value === "string" && Object.hasOwn(products, value);
}

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: storeCurrency,
  minimumFractionDigits: 0,
});

export function formatPrice(amount: number) {
  return priceFormatter.format(amount / 100);
}

export function getProductDetails(size: ProductSize) {
  const product = products[size];
  return {
    id: `personalized-poster-${product.label.toLowerCase()}`,
    name:
      size === "Digital"
        ? "Personalized Poster Digital Download"
        : `${product.label} Poster Print + Digital Download`,
    price: product.price,
  };
}
