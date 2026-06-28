import Logo from "./logo";
import { getCredits } from "@/app/utils/credits";

export default async function NavBar() {
  const credits = await getCredits();

  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <Logo />
        <p className="mt-1 text-muted-foreground">
          Credits:{" "}
          <span className="font-bold text-foreground">{credits.credits}</span> •
          Next Reset: {credits.remainingSeconds} seconds
        </p>
      </div>
    </nav>
  );
}
