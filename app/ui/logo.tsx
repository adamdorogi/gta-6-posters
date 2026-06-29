import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <Image
        src="/logo.svg"
        alt="Turn Royal Logo"
        width={125}
        height={40}
        priority
      />
    </Link>
  );
}
