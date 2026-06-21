import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo.svg"
      alt="Turn Royal Logo"
      width={150}
      height={48}
      priority
    />
  );
}
