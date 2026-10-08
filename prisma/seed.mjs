import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const databasePath = path.resolve(
  process.cwd(),
  process.env.DATABASE_URL || "./data/ai-solution-builder.db"
);

mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new DatabaseSync(databasePath);

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    domain TEXT,
    businessProblem TEXT NOT NULL DEFAULT '',
    businessTargetUsers TEXT NOT NULL DEFAULT '',
    businessGoal TEXT NOT NULL DEFAULT '',
    businessOutcome TEXT NOT NULL DEFAULT '',
    businessKpis TEXT NOT NULL DEFAULT '',
    businessPainPoints TEXT NOT NULL DEFAULT '',
    businessConstraints TEXT NOT NULL DEFAULT '',
    businessTimeline TEXT NOT NULL DEFAULT '',
    businessBudget TEXT NOT NULL DEFAULT '',
    functionalWorkflows TEXT NOT NULL DEFAULT '',
    functionalActions TEXT NOT NULL DEFAULT '',
    functionalSystems TEXT NOT NULL DEFAULT '',
    functionalIntegrations TEXT NOT NULL DEFAULT '',
    functionalDataSources TEXT NOT NULL DEFAULT '',
    functionalRequirements TEXT NOT NULL DEFAULT '',
    nonFunctionalRequirements TEXT NOT NULL DEFAULT '',
    functionalAssumptions TEXT NOT NULL DEFAULT '',
    functionalRisks TEXT NOT NULL DEFAULT '',
    spec TEXT NOT NULL DEFAULT '',
    codeApproach TEXT NOT NULL DEFAULT '',
    securityGuardrails TEXT NOT NULL DEFAULT '',
    testStrategy TEXT NOT NULL DEFAULT '',
    productionPlan TEXT NOT NULL DEFAULT '',
    measurePlan TEXT NOT NULL DEFAULT '',
    improveRoadmap TEXT NOT NULL DEFAULT '',
    maturityModel TEXT NOT NULL DEFAULT '',
    agileMapping TEXT NOT NULL DEFAULT '',
    generationStatus TEXT NOT NULL DEFAULT 'draft',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`);

function countProjects() {
  const row = db.prepare("SELECT COUNT(*) as count FROM projects").get();
  return Number(row.count);
}

function createProject({ name, description, domain }) {
  const now = new Date().toISOString();
  const id = `proj_${crypto.randomUUID().replaceAll("-", "").slice(0, 24)}`;

  db.prepare(
    `INSERT INTO projects (
      id, name, description, domain, generationStatus, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, 'draft', ?, ?)`
  ).run(id, name, description, domain ?? null, now, now);

  return { id };
}

function updateProject(id, changes) {
  const fields = Object.keys(changes);
  const assignments = fields.map((field) => `${field} = ?`).join(", ");
  const values = fields.map((field) => changes[field]);
  values.push(new Date().toISOString(), id);

  db.prepare(`UPDATE projects SET ${assignments}, updatedAt = ? WHERE id = ?`).run(...values);
}

async function main() {
  const count = countProjects();
  if (count > 0) {
    console.log("Seed skipped: projects already exist.");
    return;
  }

  const project = createProject({
    name: "Synthetic Support Blueprint",
    description: "Invented support scenario for a local presales demonstration.",
    domain: "Customer Support"
  });

  updateProject(project.id, {
    businessProblem:
      "Support analysts spend too much time searching across ERP documentation and repeating troubleshooting steps.",
    businessTargetUsers:
      "L1 support agents, technical analysts, and support managers.",
    businessGoal:
      "Reduce average handling time and increase first-contact resolution.",
    businessOutcome:
      "Faster support resolution with a reusable knowledge-driven assistant.",
    businessKpis:
      "AHT reduction, FCR rate, agent satisfaction, resolution SLA compliance.",
    businessPainPoints:
      "Fragmented documentation, inconsistent answers, manual triage, onboarding delays.",
    businessConstraints:
      "Must keep humans in control, low-risk MVP, limited initial budget.",
    businessTimeline: "6 to 8 weeks for MVP.",
    businessBudget: "Lean MVP investment with validated expansion after proof of value.",
    functionalWorkflows:
      "Agent asks question, AI proposes answer, agent reviews, answer is logged, feedback captured.",
    functionalActions:
      "Search context, summarize likely resolution, propose next steps, flag low confidence.",
    functionalSystems:
      "Support portal, ERP documentation repository, ticketing system.",
    functionalIntegrations:
      "Documentation source sync and optional ticket context lookup.",
    functionalDataSources:
      "Knowledge base articles, SOPs, historical tickets, release notes.",
    functionalRequirements:
      "Guided question intake, answer generation, confidence notes, editable outputs, project history.",
    nonFunctionalRequirements:
      "Responsive UI, basic auditability, configurable model access, persistence in SQLite for MVP.",
    functionalAssumptions:
      "Users will accept a structured workspace instead of a free-form chat-first UX.",
    functionalRisks:
      "Hallucinated guidance, stale documentation, overly broad scope requests.",
    generationStatus: "draft"
  });

  console.log("Seed created.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
