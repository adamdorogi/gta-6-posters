import Image from "next/image";
import Link from "next/link";
import Logo from "./logo";
import { site } from "../utils/site";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-[#120f1b] py-9 text-xs text-muted-foreground">
      <div className="site-container flex flex-col gap-5 text-left">
        <div className="flex items-start justify-between">
          <Logo />

          <Link
            href={`mailto:${site.email}`}
            aria-label={`Email ${site.name}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:bg-surface"
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
            href={`mailto:${site.email}`}
            className="transition-opacity duration-200 ease-in-out hover:opacity-80"
          >
            Contact
          </Link>
        </div>

        <div className="h-px w-full bg-border" />

        <p>
          © {new Date().getFullYear()}{" "}
          <Link
            href="/"
            className="transition-opacity duration-200 ease-in-out hover:opacity-80"
          >
            {site.name}
          </Link>

        </p>
      </div>
    </footer>
  );
}
