"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { withBasePath } from "@/lib/base-path";

export function ProjectCreateForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(withBasePath("/api/projects"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          description,
          domain
        })
      });

      const data = (await response.json()) as { error?: string; project?: { id: string } };

      if (!response.ok || !data.project) {
        throw new Error(data.error || "Unable to create project.");
      }

      window.location.assign(withBasePath(`/projects/${data.project.id}`));
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to create project."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field-full">
          <label htmlFor="project-name">Project name</label>
          <input
            id="project-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="AI sales copilot for field consultants"
            required
          />
        </div>

        <div className="field-full">
          <label htmlFor="project-description">Short description</label>
          <textarea
            id="project-description"
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe the business opportunity and intended outcome."
            required
          />
        </div>

        <div className="field">
          <label htmlFor="project-domain">Industry / domain</label>
          <input
            id="project-domain"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
            placeholder="Healthcare, ERP support, retail, finance..."
          />
        </div>
      </div>

      {error ? <div className="status" style={{ color: "var(--danger)" }}>{error}</div> : null}

      <div className="button-row">
        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create workspace"}
        </button>
      </div>
    </form>
  );
}
