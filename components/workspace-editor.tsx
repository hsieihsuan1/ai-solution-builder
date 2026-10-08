"use client";

import { useMemo, useState, useTransition } from "react";

import { withBasePath } from "@/lib/base-path";
import { editableSectionLabels, textAreaRows } from "@/lib/project";
import { Project } from "@/lib/types";

type WorkspaceEditorProps = {
  project: Project;
};

const stageLinks = [
  { id: "overview", label: "Overview" },
  { id: "business", label: "Business" },
  { id: "functional", label: "Functional" },
  { id: "generated", label: "Generated outputs" }
];

const businessFields: Array<{ key: keyof Project; label: string }> = [
  { key: "businessProblem", label: "Problem statement" },
  { key: "businessTargetUsers", label: "Target users" },
  { key: "businessGoal", label: "Business goal" },
  { key: "businessOutcome", label: "Expected outcome" },
  { key: "businessKpis", label: "Success metrics / KPIs" },
  { key: "businessPainPoints", label: "Current pain points" },
  { key: "businessConstraints", label: "Constraints" },
  { key: "businessTimeline", label: "Timeline" },
  { key: "businessBudget", label: "Budget maturity / investment expectation" }
];

const functionalFields: Array<{ key: keyof Project; label: string }> = [
  { key: "functionalWorkflows", label: "Key workflows" },
  { key: "functionalActions", label: "User actions" },
  { key: "functionalSystems", label: "Systems involved" },
  { key: "functionalIntegrations", label: "Integrations needed" },
  { key: "functionalDataSources", label: "Data sources" },
  { key: "functionalRequirements", label: "Functional requirements" },
  { key: "nonFunctionalRequirements", label: "Non-functional requirements" },
  { key: "functionalAssumptions", label: "Assumptions" },
  { key: "functionalRisks", label: "Risks" }
];

const generatedFields = [
  "spec",
  "codeApproach",
  "securityGuardrails",
  "testStrategy",
  "productionPlan",
  "measurePlan",
  "improveRoadmap",
  "maturityModel",
  "agileMapping"
] as const;

type GeneratedFieldKey = (typeof generatedFields)[number];
type GenerationMode = "draft" | "generated" | "mock";

export function WorkspaceEditor({ project }: WorkspaceEditorProps) {
  const [formState, setFormState] = useState<Record<string, string>>({
    name: project.name,
    description: project.description,
    domain: project.domain ?? "",
    businessProblem: project.businessProblem,
    businessTargetUsers: project.businessTargetUsers,
    businessGoal: project.businessGoal,
    businessOutcome: project.businessOutcome,
    businessKpis: project.businessKpis,
    businessPainPoints: project.businessPainPoints,
    businessConstraints: project.businessConstraints,
    businessTimeline: project.businessTimeline,
    businessBudget: project.businessBudget,
    functionalWorkflows: project.functionalWorkflows,
    functionalActions: project.functionalActions,
    functionalSystems: project.functionalSystems,
    functionalIntegrations: project.functionalIntegrations,
    functionalDataSources: project.functionalDataSources,
    functionalRequirements: project.functionalRequirements,
    nonFunctionalRequirements: project.nonFunctionalRequirements,
    functionalAssumptions: project.functionalAssumptions,
    functionalRisks: project.functionalRisks,
    spec: project.spec,
    codeApproach: project.codeApproach,
    securityGuardrails: project.securityGuardrails,
    testStrategy: project.testStrategy,
    productionPlan: project.productionPlan,
    measurePlan: project.measurePlan,
    improveRoadmap: project.improveRoadmap,
    maturityModel: project.maturityModel,
    agileMapping: project.agileMapping
  });
  const [infoMessage, setInfoMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [lastMode, setLastMode] = useState<GenerationMode>(project.generationStatus);
  const [isSaving, startSaving] = useTransition();
  const [isGenerating, startGenerating] = useTransition();

  const generatedReady = useMemo(
    () => generatedFields.some((field) => formState[field].trim().length > 0),
    [formState]
  );

  function updateField(key: string, value: string) {
    setFormState((current) => ({
      ...current,
      [key]: value
    }));
  }

  function saveProject() {
    setInfoMessage("");
    setErrorMessage("");

    startSaving(async () => {
      try {
        const response = await fetch(withBasePath(`/api/projects/${project.id}`), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formState)
        });

        const data = (await response.json()) as { error?: string };

        if (!response.ok) {
          throw new Error(data.error || "Unable to save changes.");
        }

        setInfoMessage("Project changes saved.");
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Unable to save changes.");
      }
    });
  }

  function generateOutputs() {
    setInfoMessage("");
    setErrorMessage("");

    startGenerating(async () => {
      try {
        const saved = await fetch(withBasePath(`/api/projects/${project.id}`), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formState) });
        if (!saved.ok) { const data = await saved.json(); throw new Error(data.error || "Unable to save inputs."); }
        const response = await fetch(withBasePath(`/api/projects/${project.id}/generate`), {
          method: "POST"
        });

        const data = (await response.json()) as {
          error?: string;
          mode?: string;
          project?: Record<string, string>;
        };

        if (!response.ok || !data.project) {
          throw new Error(data.error || "Unable to generate outputs.");
        }

        setFormState((current) => ({
          ...current,
          ...data.project
        }));
        setLastMode((data.mode as GenerationMode | undefined) || "generated");
        setInfoMessage("Local template draft generated. No AI model or external service was called.");
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Unable to generate outputs.");
      }
    });
  }

  return (
    <div className="section-grid">
      <aside className="panel sticky-nav">
        <span className="eyebrow">Workspace map</span>
        <div className="stage-list">
          {stageLinks.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {item.label}
            </a>
          ))}
        </div>
      </aside>

      <div className="workspace">
        <section className="panel" id="overview">
          <div className="split-actions">
            <div>
              <span className="eyebrow">Project workspace</span>
              <h1>{formState.name}</h1>
              <p className="muted">
                Local demo, synthetic data only. No authentication. Generated content is a template draft, not AI advice.
              </p>
            </div>
            <div className="button-row">
              <button className="button-ghost" onClick={saveProject} type="button" disabled={isSaving || isGenerating}>
                {isSaving ? "Saving..." : "Save changes"}
              </button>
              <button className="button" onClick={generateOutputs} type="button" disabled={isSaving || isGenerating}>
                {isGenerating ? "Generating..." : "Generate solution"}
              </button>
            </div>
          </div>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="name">Project name</label>
              <input
                id="name"
                value={formState.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="domain">Industry / domain</label>
              <input
                id="domain"
                value={formState.domain}
                onChange={(event) => updateField("domain", event.target.value)}
              />
            </div>
            <div className="field-full">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows={4}
                value={formState.description}
                onChange={(event) => updateField("description", event.target.value)}
              />
            </div>
          </div>

          <div className="button-row">
            <span className="status">
              <span className="dot" />
              Status: {project.generationStatus === "generated" || generatedReady ? "Generated or edited outputs present" : "Draft"}
            </span>
            <span className="status">
              <span className="dot" />
              Mode: {lastMode}
            </span>
          </div>

          {infoMessage ? <div className="status" style={{ color: "var(--primary)" }}>{infoMessage}</div> : null}
          {errorMessage ? <div className="status" style={{ color: "var(--danger)" }}>{errorMessage}</div> : null}
        </section>

        <section className="panel" id="business">
          <span className="eyebrow">Stage 1</span>
          <h2>Business</h2>
          <p className="muted">
            Define the business problem, the target audience, and what success looks like.
          </p>
          <div className="form-grid">
            {businessFields.map((field) => (
              <div
                key={field.key}
                className={
                  field.key === "businessProblem" || field.key === "businessPainPoints"
                    ? "field-full"
                    : "field"
                }
              >
                <label htmlFor={field.key}>{field.label}</label>
                <textarea
                  id={field.key}
                  rows={textAreaRows[field.key] ?? 3}
                  value={formState[field.key] ?? ""}
                  onChange={(event) => updateField(field.key, event.target.value)}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="panel" id="functional">
          <span className="eyebrow">Stage 2</span>
          <h2>Functional</h2>
          <p className="muted">
            Capture workflows, systems, requirements, assumptions, and delivery risks.
          </p>
          <div className="form-grid">
            {functionalFields.map((field) => (
              <div
                key={field.key}
                className={
                  field.key === "functionalWorkflows" || field.key === "functionalRequirements"
                    ? "field-full"
                    : "field"
                }
              >
                <label htmlFor={field.key}>{field.label}</label>
                <textarea
                  id={field.key}
                  rows={textAreaRows[field.key] ?? 3}
                  value={formState[field.key] ?? ""}
                  onChange={(event) => updateField(field.key, event.target.value)}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="panel" id="generated">
          <div className="split-actions">
            <div>
              <span className="eyebrow">Stages 3-9</span>
              <h2>Generated outputs</h2>
              <p className="muted">
                Review and edit each section. These outputs are fully editable and saved
                together with the project.
              </p>
            </div>
            <button className="button-secondary" onClick={generateOutputs} type="button" disabled={isSaving || isGenerating}>
              {isGenerating ? "Generating..." : "Regenerate all"}
            </button>
          </div>

          <div className="stack">
            {generatedFields.map((field) => (
              <div className="output-card" key={field}>
                <div className="split-actions">
                  <div>
                    <h3>{editableSectionLabels[field]}</h3>
                    <p className="helper">
                      Editable template draft. Review every assumption before use.
                    </p>
                  </div>
                </div>
                <textarea
                  rows={14}
                  value={formState[field]}
                  onChange={(event) => updateField(field, event.target.value)}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
