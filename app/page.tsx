import Link from "next/link";

import { listProjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = listProjects(6);

  return (
    <main className="page-shell">
      <div className="topbar">
        <div className="brand">
          <span className="eyebrow">Local portfolio demo</span>
          <strong>AI Solution Builder</strong>
        </div>
        <div className="button-row">
          <Link className="button-ghost" href="/docs/architecture">
            Architecture note
          </Link>
          <Link className="button" href="/projects/new">
            Create new project
          </Link>
        </div>
      </div>

      <section className="hero">
        <div className="hero-copy card">
          <span className="eyebrow">Business-first solution workspace</span>
          <h1>Turn solution ideas into editable solution drafts.</h1>
          <p>
            Capture Business and Functional context first. Then generate structured
            output for Spec, Code, Guardrails, Test, Production, Measure, Improve,
            and a Crawl / Walk / Run / Fly maturity path.
          </p>
          <div className="button-row">
            <Link className="button" href="/projects/new">
              Start a project
            </Link>
            <Link className="button-secondary" href="#recent-projects">
              Browse sample work
            </Link>
          </div>
          <div className="hero-metrics">
            <div className="metric">
              <strong>2</strong>
              Guided discovery stages before template generation
            </div>
            <div className="metric">
              <strong>9</strong>
              Structured downstream sections to refine
            </div>
            <div className="metric">
              <strong>1</strong>
              Focused MVP codebase for fast iteration
            </div>
          </div>
        </div>

        <div className="hero-side panel">
          <span className="eyebrow">Why this product</span>
          <h2>Not another generic chat UI</h2>
          <p className="muted">
            The workspace keeps clear traceability from business problem to technical
            direction. Users work through structured stages, editable
            outputs, and pragmatic delivery artifacts.
          </p>
          <div className="stack">
            <div className="output-card">
              <strong>Business</strong>
              <p className="muted">Problem, users, goals, outcomes, metrics, constraints.</p>
            </div>
            <div className="output-card">
              <strong>Functional</strong>
              <p className="muted">Workflows, integrations, requirements, data sources, risks.</p>
            </div>
            <div className="output-card">
              <strong>Generated Solution Stack</strong>
              <p className="muted">Spec, code approach, guardrails, tests, production, measure, improve.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="recent-projects" className="panel">
        <div className="split-actions">
          <div>
            <span className="eyebrow">Recent workspaces</span>
            <h2>Projects ready to explore</h2>
          </div>
          <Link className="button-ghost" href="/projects/new">
            New workspace
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="empty-state">
            <strong>No projects yet.</strong>
            <p className="muted">
              Create your first project to walk through Business, Functional, and template-based
              solution design.
            </p>
          </div>
        ) : (
          <div className="project-grid">
            {projects.map((project) => (
              <Link key={project.id} className="project-card" href={`/projects/${project.id}`}>
                <span className="badge">{project.domain || "General solution design"}</span>
                <h3>{project.name}</h3>
                <p className="muted">{project.description}</p>
                <div className="status">
                  <span className="dot" />
                  {project.generationStatus === "generated"
                    ? "Generated outputs available"
                    : "Draft workspace"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
