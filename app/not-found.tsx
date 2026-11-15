import Link from "next/link";

export default function NotFound() {
  return (
    <main className="site-container flex flex-1 flex-col items-start justify-center py-16">
      <h1 className="section-title">Page not found</h1>
      <p className="section-lead mt-3">This link doesn’t lead to a page or poster preview.</p>
      <Link href="/" className="site-button mt-6">
        Go to GTA 6 Posters
      </Link>
    </main>
  );
}
