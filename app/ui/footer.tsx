export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border text-center text-sm text-muted-foreground">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        <div className="flex justify-center gap-6 mb-4 font-medium text-muted-foreground">
          <a href="#" className="hover:text-primary">
            Terms of Service
          </a>
          <a href="#" className="hover:text-primary">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary">
            Shipping Info
          </a>
        </div>
        <p>
          © {new Date().getFullYear()} Turn Royal. Crafting timeless memories.
        </p>
      </div>
    </footer>
  );
}
