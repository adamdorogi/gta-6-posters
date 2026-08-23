import Image from "next/image";
import ScrollToTopButton from "./scroll-to-top-button";

export default function MockupSection({
  hideScrollButton = false,
}: {
  hideScrollButton?: boolean;
}) {
  return (
    <section
      id="how-it-looks"
      className="px-4 md:px-8 py-6 md:py-8 mx-auto bg-background w-full"
    >
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex w-fit mx-auto items-center gap-1 px-4 py-1.5 rounded-full bg-primary-accent tracking-wide text-primary text-sm font-medium mb-4 md:mb-5">
          <span className="font-bold uppercase">How it looks</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-serif italic font-black text-foreground mb-2">
          Museum quality, made for your home
        </h2>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-6">
          Your portrait is enhanced to 12K resolution, and printed in Australia.
          A stunning artwork designed to last for years.
        </p>

        <div className="mt-8 grid items-center gap-6 lg:grid-cols-2 lg:gap-10">
          <Image
            src="/mockup.jpg"
            alt="Turn Royal canvas mockup — a premium AI portrait print on museum-quality canvas"
            width={576}
            height={576}
            className="max-w-xl mx-auto rounded-2xl shadow-2xl w-full h-auto object-cover"
            priority
          />

          <div className="grid gap-2 md:gap-4 md:grid-cols-2 text-left">
            {[
              {
                title: "Polycotton material",
                description:
                  "Satin-finish canvas printed on premium wide-format eco-solvent polycotton.",
                icon: "/polycotton.svg",
              },
              {
                title: "New Zealand pinewood frame",
                description:
                  "A strong, sturdy wooden frame made from high-quality New Zealand pine.",
                icon: "/frame.svg",
              },
              {
                title: "Includes self-assembly kit",
                description:
                  "Your print arrives ready to hang with a simple self-assembly mounting kit.",
                icon: "/assembly-kit.svg",
              },
              {
                title: "Vibrant colours",
                description:
                  "Sharp, vivid colour reproduction using the latest Epson printing technology.",
                icon: "/colours.svg",
              },
            ].map((item) => (
              <div key={item.title} className="group rounded-2xl p-4 bg-white">
                <div className="flex flex-row md:flex-col items-center md:items-start gap-4">
                  <Image
                    alt={item.title}
                    src={item.icon}
                    width={48}
                    height={48}
                  />
                  <div className="flex-col">
                    <p className="text-base font-semibold tracking-tight text-foreground mb-2">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {!hideScrollButton && (
          <ScrollToTopButton>
            <Image
              src="/sparkle.svg"
              alt="Sparkle Icon"
              width={24}
              height={24}
              priority
              className="invert"
            />
            Create My Free Preview
          </ScrollToTopButton>
        )}
      </div>
    </section>
  );
}
