import Link from "next/link";
import { notFound } from "next/navigation";

import { WorkspaceEditor } from "@/components/workspace-editor";
import { getProjectById } from "@/lib/db";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <main className="page-shell">
      <div className="topbar">
        <div className="brand">
          <span className="eyebrow">Project workspace</span>
          <strong>{project.name}</strong>
        </div>
        <div className="button-row">
          <Link className="button-ghost" href="/">
            Back to home
          </Link>
        </div>
      </div>

      <WorkspaceEditor project={project} />
    </main>
  );
}
