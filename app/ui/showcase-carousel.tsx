import Image from "next/image";

export default function ShowcaseCarousel({
  images = [],
  layout = "vertical",
}: {
  images: string[];
  layout?: "vertical" | "horizontal";
}) {
  if (layout === "horizontal") {
    const SECONDS_PER_IMAGE = 8;
    const duration = Math.max(images.length * SECONDS_PER_IMAGE, 1);

    return (
      <div className="relative h-full overflow-hidden">
        <div
          className="flex h-full w-max gap-4"
          style={{ animation: `horizontal-slide ${duration}s linear infinite` }}
        >
          {[...images, ...images].map((src, idx) => (
            <div
              key={idx}
              className="relative h-full w-40 flex-none overflow-hidden rounded-2xl shadow-md group"
            >
              <Image
                src={src}
                alt={
                  src.split("/").pop()?.split(".")[0] ||
                  `Sample royal portrait ${idx + 1}`
                }
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="182px"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const col1 = images.filter((_, i) => i % 2 === 0);
  const col2 = images.filter((_, i) => i % 2 !== 0);

  const SECONDS_PER_IMAGE = 10;
  const duration1 = Math.max(col1.length * SECONDS_PER_IMAGE, 1);
  const duration2 = Math.max(col2.length * SECONDS_PER_IMAGE, 1);

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {/* Column 1 */}
      <div className="relative overflow-hidden">
        <div
          className="flex flex-col"
          style={{ animation: `vertical-slide ${duration1}s linear infinite` }}
        >
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
                sizes="172px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Column 2 */}
      <div className="relative overflow-hidden">
        <div
          className="flex flex-col"
          style={{
            animation: `vertical-slide ${duration2}s linear infinite reverse`,
          }}
        >
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
                sizes="172px"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
