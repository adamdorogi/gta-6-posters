import Image from "next/image";
import Link from "next/link";
import { site } from "../utils/site";

export default function Logo() {
  return (
    <Link href="/" className="site-wordmark" aria-label={site.name}>
      <Image
        src="/logo-mark.svg"
        alt=""
        aria-hidden="true"
        width={74}
        height={72}
        loading="eager"
        className="site-wordmark__mark"
      />
      {site.name}
    </Link>
  );
}
