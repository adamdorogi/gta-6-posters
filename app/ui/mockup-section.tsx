import Image from "next/image";
import ScrollToTopButton from "./scroll-to-top-button";

const details = [
  {
    title: "Glossy poster paper",
    description:
      "Your artwork is printed on smooth, glossy paper in A4, A3, A2, or A1.",
    icon: "/frame.svg",
  },
  {
    title: "Ready to frame",
    description:
      "The poster arrives unframed so you can choose a frame that suits your space.",
    icon: "/assembly-kit.svg",
  },
  {
    title: "High-resolution artwork",
    description:
      "We upscale your approved design before printing for crisp details.",
    icon: "/download.svg",
  },
  {
    title: "Worldwide delivery",
    description:
      "See available shipping destinations when you order.",
    icon: "/box.svg",
  },
];

export default function MockupSection({
  hideScrollButton = false,
}: {
  hideScrollButton?: boolean;
}) {
  return (
    <section id="how-it-looks" className="site-section bg-background">
      <div className="site-container print-layout">
        <div className="print-layout__intro">
          <h2 className="section-title max-w-[18ch]">Your poster, made for your wall</h2>
          <p className="section-lead mt-4">
            Bring your favorite preview off the screen. Each print comes with a high-resolution digital download.
          </p>
        </div>
        <figure className="print-layout__image">
          <Image
            src="/posters/print-in-room.webp"
            alt="GTA 6-style poster of a golden retriever in a convertible, displayed on a wall"
            width={1200}
            height={960}
            sizes="(min-width: 960px) 46vw, 100vw"
            className="h-auto w-full rounded-xl object-cover"
          />
          <figcaption className="mt-3 text-xs font-bold tracking-[0.14em] text-primary uppercase">
            How it looks
          </figcaption>
        </figure>
        <div className="print-layout__details">
          <ul className="grid gap-x-6 sm:grid-cols-2">
            {details.map((item) => (
              <li key={item.title} className="border-t border-border py-4">
                <div className="flex items-start gap-3">
                  <Image
                    alt={item.title}
                    src={item.icon}
                    width={26}
                    height={26}
                    className="mt-0.5 shrink-0 brightness-0 invert"
                  />
                  <div>
                    <p className="font-display text-xl leading-tight font-bold uppercase">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {!hideScrollButton && (
            <div className="mt-5">
              <ScrollToTopButton>
                <Image src="/sparkle.svg" alt="Sparkle Icon" width={20} height={20} />
                Create My Free Preview
              </ScrollToTopButton>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
