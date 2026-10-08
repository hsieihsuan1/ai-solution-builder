import { ProjectCreateForm } from "@/components/project-create-form";

export default function NewProjectPage() {
  return (
    <main className="page-shell">
      <div className="topbar">
        <div className="brand">
          <span className="eyebrow">New workspace</span>
          <strong>Create an AI solution project</strong>
        </div>
      </div>

      <section className="panel" style={{ maxWidth: 860, margin: "0 auto" }}>
        <span className="eyebrow">Project setup</span>
        <h1>Name the initiative and frame its context.</h1>
        <p className="muted">
          Start with the minimum project definition. After creation, you will continue
          into the Business and Functional stages and then generate the rest of the
          blueprint.
        </p>
        <ProjectCreateForm />
      </section>
    </main>
  );
}
