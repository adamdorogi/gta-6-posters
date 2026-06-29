import { sale } from "../utils/pricing";

export default function PromoBanner() {
  return (
    <div className="bg-primary text-white py-2 px-4 text-center text-sm font-bold">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2">
        <span className="flex items-center gap-1">
          {sale.name.toUpperCase()}: {sale.discount}% OFF + FREE SHIPPING
        </span>
      </div>
    </div>
  );
}
