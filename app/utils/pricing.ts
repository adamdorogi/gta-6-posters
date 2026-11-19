export const defaultCurrency = "USD";
export type StoreCurrency = "USD" | "HUF";

export const printSizes = ["Small", "Medium", "Large", "XL"] as const;

export const products = {
  Small: { label: "A4", price: 1000, widthMm: 210, heightMm: 297 },
  Medium: { label: "A3", price: 1500, widthMm: 297, heightMm: 420 },
  Large: { label: "A2", price: 2200, widthMm: 420, heightMm: 594 },
  XL: { label: "A1", price: 3200, widthMm: 594, heightMm: 841 },
  Digital: { label: "Digital", price: 400 },
} as const;

export type ProductSize = keyof typeof products;

// Stripe represents both USD and HUF charges in hundredths of the currency.
const hungarianPrices: Record<ProductSize, number> = {
  Small: 325000,
  Medium: 525000,
  Large: 725000,
  XL: 1125000,
  Digital: 100000,
};

export function getCurrencyForCountry(country: string | null | undefined): StoreCurrency {
  return country?.trim().toUpperCase() === "HU" ? "HUF" : defaultCurrency;
}

export function isProductSize(value: unknown): value is ProductSize {
  return typeof value === "string" && Object.hasOwn(products, value);
}

const priceFormatters = {
  USD: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }),
  HUF: new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "HUF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }),
};

export function formatPrice(amount: number, currency: StoreCurrency = defaultCurrency) {
  return priceFormatters[currency].format(amount / 100);
}

export function getProductDetails(size: ProductSize, currency: StoreCurrency = defaultCurrency) {
  const product = products[size];
  const price = currency === "HUF" ? hungarianPrices[size] : product.price;
  return {
    id: `personalized-poster-${product.label.toLowerCase()}`,
    name:
      size === "Digital"
        ? "Personalized Poster Digital Download"
        : `${product.label} Poster Print + Digital Download`,
    price,
  };
}
