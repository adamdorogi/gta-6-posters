import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  light?: boolean;
};

export default function Logo({ light = false }: LogoProps) {
  return (
    <Link href="/">
      <Image
        src={light ? "/logo-light.svg" : "/logo.svg"}
        alt="Turn Royal Logo"
        width={125}
        height={40}
        priority
      />
    </Link>
  );
}
