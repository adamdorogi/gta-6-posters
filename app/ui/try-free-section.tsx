import Image from "next/image";
import ScrollToTopButton from "./scroll-to-top-button";

export default function TryFreeSection() {
  return (
    <section
      id="try-free"
      className="bg-linear-135 from-gradient-light to-gradient-dark py-10 md:py-16 px-4 md:px-8 mx-auto bg-muted w-full text-primary-foreground"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-serif italic font-black mb-2 md:mb-3">
          Your <span className="text-accent">Portrait</span> Awaits
        </h2>
        <p className="text-base max-w-xl mx-auto">
          Your first portrait is just one click away. No card, no signup, no
          risk.
        </p>

        {/* Value props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 pt-6">
          {[
            {
              icon: "🎁",
              title: "A Gift for Pet Lovers",
              desc: "A portrait of their beloved pet, made for birthdays, anniversaries and special moments.",
            },
            {
              icon: "🇦🇺",
              title: "Printed in Australia",
              desc: "Your canvas is produced and shipped from Victoria for reliable quality and delivery.",
            },
            {
              icon: "⚡",
              title: "Preview Before You Buy",
              desc: "See your portrait first, then choose a canvas or digital download when you’re ready.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-row md:justify-center md:flex-col items-center gap-6 md:gap-2 rounded-2xl bg-primary-foreground/10 p-5 md:p-6 text-left md:text-center"
            >
              <span className="text-4xl md:text-6xl" aria-hidden="true">
                {item.icon}
              </span>
              <div className="flex flex-col gap-1 md:gap-2">
                <h3 className="text-base font-bold text-primary-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
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

        {/* Trust line */}
        <div className="p-4 pb-0 lg:px-12 max-w-4xl flex flex-wrap gap-6 justify-center">
          {["Free Preview", "No Credit Card", "No Signup"].map((benefit, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-xs md:text-sm text-muted"
            >
              <Image
                src="/tick.svg"
                alt="Tick Icon"
                width={12}
                height={12}
                priority
              />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
