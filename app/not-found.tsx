import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="page-shell">
      <section className="panel" style={{ maxWidth: 720, margin: "0 auto" }}>
        <span className="eyebrow">Not found</span>
        <h1>This workspace does not exist.</h1>
        <p className="muted">
          The project may have been removed or the URL might be incomplete.
        </p>
        <div className="button-row">
          <Link className="button" href="/">
            Return home
          </Link>
        </div>
      </section>
    </main>
  );
}
