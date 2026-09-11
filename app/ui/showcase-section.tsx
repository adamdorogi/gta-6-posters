import PortraitCarousel from "./portrait-carousel";

export default function ShowcaseSection({
  portraitFiles: portraitFiles,
}: {
  portraitFiles: string[];
}) {
  return (
    <section
      id="showcase"
      className="px-6 py-6 md:py-8 mx-auto bg-muted w-full"
    >
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex w-fit mx-auto items-center gap-1 px-4 py-1.5 rounded-full bg-primary-accent tracking-wide text-primary text-sm font-medium mb-4 md:mb-5">
          <span className="font-bold uppercase">Showcase</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-serif italic font-black text-foreground mb-2">
          See what others have made
        </h2>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-6">
          Hand picked from hundreds of creative portraits
        </p>
      </div>
      <div className="-mx-6">
        <PortraitCarousel portraitFiles={portraitFiles} />
      </div>
    </section>
  );
}
