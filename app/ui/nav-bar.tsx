import Logo from "./logo";
import { getCredits } from "@/app/utils/credits";
import CreditsCountdown from "./credits-countdown";

export default async function NavBar() {
  const credits = await getCredits();

  return (
    <nav className="bg-primary-foreground max-w-full border-b border-border">
      <div className="flex items-center justify-between px-6 py-3 max-w-5xl mx-auto w-full">
        <Logo />
        <CreditsCountdown
          key={`${credits.credits}-${credits.remainingSeconds}`}
          initialCredits={credits.credits}
          initialRemainingSeconds={credits.remainingSeconds}
        />
      </div>
    </nav>
  );
}
