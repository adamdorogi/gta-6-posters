import PortraitCarousel from "./portrait-carousel";
import { showcaseExamples } from "@/app/utils/showcase";

export default function ShowcaseSection() {
  return (
    <section id="showcase" className="site-section overflow-hidden border-t border-border bg-[#21182e]">
      <div className="site-container mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
        <div>
          <h2 className="section-title">Explore the poster styles</h2>
          <p className="section-lead mt-3">From comic-book panels to cinematic sunsets, see how each style frames the story.</p>
        </div>
      </div>
      <PortraitCarousel posters={showcaseExamples} />
    </section>
  );
}
