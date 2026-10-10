import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 pt-40 text-center sm:px-6">
      <h1 className="text-4xl font-[660] text-midnight">This page doesn&rsquo;t exist.</h1>
      <p className="mt-4 text-muted">The link may be out of date. Head back to the homepage to see our work.</p>
      <Link href="/" className="btn btn-primary mt-8">
        Go to homepage
      </Link>
    </div>
  );
}
