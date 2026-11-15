import Image from "next/image";
import ScrollToTopButton from "./scroll-to-top-button";

const valueProps = [
  {
    title: "A poster made for them",
    desc: "Turn a favorite photo of a friend, partner, or family member into a personalized gift.",
  },
  {
    title: "Worldwide shipping",
    desc: "Order a printed poster for your wall or send one as a gift.",
  },
  {
    title: "Preview Before You Buy",
    desc: "See your poster first, then choose a print or digital download when you’re ready.",
  },
];

export default function TryFreeSection() {
  return (
    <section id="try-free" className="site-section closing-section">
      <div className="site-container text-center">
        <h2 className="section-title">
          Make it <span className="text-primary">your poster</span>
        </h2>
        <p className="section-lead mx-auto mt-4">
          Start with a selfie or group photo. Your first preview is free, with no card or signup.
        </p>

        <div className="mx-auto mt-8 grid max-w-4xl gap-6 border-y border-border py-6 text-left sm:grid-cols-3">
          {valueProps.map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-2xl leading-tight font-bold uppercase">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <ScrollToTopButton>
            <Image src="/sparkle.svg" alt="Sparkle Icon" width={20} height={20} />
            Create My Free Preview
          </ScrollToTopButton>
        </div>

        <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          {["Free Preview", "No Credit Card", "No Signup"].map((benefit) => (
            <li key={benefit} className="inline-flex items-center gap-1.5">
              <Image src="/tick.svg" alt="Tick Icon" width={13} height={13} />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
