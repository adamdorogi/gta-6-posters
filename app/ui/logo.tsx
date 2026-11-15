import Link from "next/link";
import { site } from "../utils/site";

export default function Logo() {
  return (
    <Link href="/" className="site-wordmark" aria-label={site.name}>
      {site.name}
    </Link>
  );
}
