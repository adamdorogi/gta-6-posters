import Logo from "./logo";
import { getCredits } from "@/app/utils/credits";
import CreditsCountdown from "./credits-countdown";

export default async function NavBar() {
  const credits = await getCredits();

  return (
    <nav className="site-nav">
      <div className="site-container flex min-h-[4.25rem] items-center justify-between gap-3 py-3">
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
