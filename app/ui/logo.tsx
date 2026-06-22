import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo.svg"
      alt="Turn Royal Logo"
      width={125}
      height={40}
      priority
    />
  );
}
