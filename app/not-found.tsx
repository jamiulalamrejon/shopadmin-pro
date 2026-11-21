// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <p className="text-5xl font-semibold text-brand-600">404</p>
        <h1 className="mt-3 text-lg font-medium">This page doesn&apos;t exist</h1>
        <Link href="/dashboard" className="btn-primary mt-6">Back to dashboard</Link>
      </div>
    </main>
  );
}
