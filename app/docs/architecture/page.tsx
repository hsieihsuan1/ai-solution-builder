import Link from "next/link";

export default function ArchitecturePage() {
  return (
    <main className="page-shell">
      <div className="topbar">
        <div className="brand">
          <span className="eyebrow">Architecture note</span>
          <strong>MVP implementation decisions</strong>
        </div>
        <Link className="button-ghost" href="/">
          Back to home
        </Link>
      </div>

      <section className="panel stack">
        <div>
          <h1>Architecture summary</h1>
          <p className="muted">
            The MVP uses a single Next.js codebase so the UI, persistence layer, and
            generation routes ship together with minimal operational overhead.
          </p>
        </div>

        <div className="three-grid">
          <div className="output-card">
            <h3>Frontend</h3>
            <p className="muted">
              App Router pages and a client-side workspace editor guide the user through
              project setup, Business, Functional, and generated stages.
            </p>
          </div>
          <div className="output-card">
            <h3>Backend</h3>
            <p className="muted">
              Route handlers provide create, update, list, and generate operations
              against a simple SQLite-backed project store. The API shape stays simple
              and has no authentication or ownership isolation. Use synthetic data on loopback only.
            </p>
          </div>
          <div className="output-card">
            <h3>Persistence</h3>
            <p className="muted">
              SQLite keeps local setup lightweight. The `projects` table stores both the
              guided inputs and the editable generated outputs in one place.
            </p>
          </div>
        </div>

        <div className="output-card">
          <h3>AI integration</h3>
          <p className="muted">
            The curated local demo uses a deterministic template adapter. It runs no AI model and sends no inputs to external providers. The private original had optional remote providers; those paths are excluded from this release.
          </p>
        </div>

        <div className="output-card">
          <h3>Why this shape</h3>
          <p className="muted">
            The product is intentionally monolithic for MVP speed. The design leaves room
            to add auth, PostgreSQL, async jobs, section-level regeneration, and richer
            collaboration later without discarding the current flow.
          </p>
        </div>
      </section>
    </main>
  );
}
