import Image from "next/image";

export default function ShowcaseCarousel({
  images = [],
}: {
  images: string[];
}) {
  const col1 = images.filter((_, i) => i % 2 === 0);
  const col2 = images.filter((_, i) => i % 2 !== 0);

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {/* Column 1 */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="flex flex-col animate-vertical-slide">
          {[...col1, ...col1].map((src, idx) => (
            <div
              key={idx}
              className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-md group mb-4"
            >
              <Image
                src={src}
                alt={
                  src.split("/").pop()?.split(".")[0] ||
                  `Sample royal portrait ${idx + 1}`
                }
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Column 2 */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="flex flex-col animate-vertical-slide-reverse">
          {[...col2, ...col2].map((src, idx) => (
            <div
              key={idx}
              className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-md group mb-4"
            >
              <Image
                src={src}
                alt={
                  src.split("/").pop()?.split(".")[0] ||
                  `Sample royal portrait ${idx + 1}`
                }
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
