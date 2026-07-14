import Logo from "./logo";

export default function Footer() {
  return (
    <footer className="bg-linear-135 from-gradient-light to-gradient-dark py-6 px-6 text-xs text-muted">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 text-left">
        <Logo light />

        <div className="flex flex-wrap gap-6">
          <a
            href="#"
            className="transition-opacity duration-200 ease-in-out hover:opacity-80"
          >
            Privacy
          </a>
          <a
            href="#"
            className="transition-opacity duration-200 ease-in-out hover:opacity-80"
          >
            Terms
          </a>
          <a
            href="#"
            className="transition-opacity duration-200 ease-in-out hover:opacity-80"
          >
            Contact
          </a>
        </div>

        <div className="h-px w-full bg-muted/20" />

        <p>
          © {new Date().getFullYear()} Turn Royal. Crafting timeless memories.
        </p>
      </div>
    </footer>
  );
}
