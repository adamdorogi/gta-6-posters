import Image from "next/image";
import Link from "next/link";
import Logo from "./logo";

export default function Footer() {
  return (
    <footer className="bg-primary py-6 px-6 text-xs text-muted">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 text-left">
        <div className="flex items-start justify-between">
          <Logo light />

          <Link
            href="mailto:hello@turnroyal.com"
            aria-label="Email Turn Royal"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-muted/20 transition-opacity duration-200 ease-in-out hover:opacity-80"
          >
            <Image src="/email.svg" alt="Email Icon" width={20} height={20} />
          </Link>
        </div>

        <div className="flex flex-wrap gap-6">
          <Link
            href="/privacy"
            className="transition-opacity duration-200 ease-in-out hover:opacity-80"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="transition-opacity duration-200 ease-in-out hover:opacity-80"
          >
            Terms
          </Link>
          <Link
            href="mailto:hello@turnroyal.com"
            className="transition-opacity duration-200 ease-in-out hover:opacity-80"
          >
            Contact
          </Link>
        </div>

        <div className="h-px w-full bg-muted/20" />

        <p>
          © {new Date().getFullYear()}{" "}
          <Link
            href="/"
            className="transition-opacity duration-200 ease-in-out hover:opacity-80"
          >
            Turn Royal
          </Link>
          . Turning pets into royalty.
        </p>
      </div>
    </footer>
  );
}
