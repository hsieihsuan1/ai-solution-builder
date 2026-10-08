import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

import { Project } from "@/lib/types";

const databasePath = path.resolve(
  process.cwd(),
  process.env.DATABASE_URL || "./data/ai-solution-builder.db"
);

mkdirSync(path.dirname(databasePath), { recursive: true });

const globalForDb = globalThis as unknown as {
  sqlite?: DatabaseSync;
};

export const db =
  globalForDb.sqlite ??
  new DatabaseSync(databasePath);

if (process.env.NODE_ENV !== "production") {
  globalForDb.sqlite = db;
}

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

function rowToProject(row: Record<string, unknown>): Project {
  return {
    id: String(row.id),
    name: String(row.name),
    description: String(row.description),
    domain: row.domain ? String(row.domain) : null,
    businessProblem: String(row.businessProblem),
    businessTargetUsers: String(row.businessTargetUsers),
    businessGoal: String(row.businessGoal),
    businessOutcome: String(row.businessOutcome),
    businessKpis: String(row.businessKpis),
    businessPainPoints: String(row.businessPainPoints),
    businessConstraints: String(row.businessConstraints),
    businessTimeline: String(row.businessTimeline),
    businessBudget: String(row.businessBudget),
    functionalWorkflows: String(row.functionalWorkflows),
    functionalActions: String(row.functionalActions),
    functionalSystems: String(row.functionalSystems),
    functionalIntegrations: String(row.functionalIntegrations),
    functionalDataSources: String(row.functionalDataSources),
    functionalRequirements: String(row.functionalRequirements),
    nonFunctionalRequirements: String(row.nonFunctionalRequirements),
    functionalAssumptions: String(row.functionalAssumptions),
    functionalRisks: String(row.functionalRisks),
    spec: String(row.spec),
    codeApproach: String(row.codeApproach),
    securityGuardrails: String(row.securityGuardrails),
    testStrategy: String(row.testStrategy),
    productionPlan: String(row.productionPlan),
    measurePlan: String(row.measurePlan),
    improveRoadmap: String(row.improveRoadmap),
    maturityModel: String(row.maturityModel),
    agileMapping: String(row.agileMapping),
    generationStatus: String(row.generationStatus) as Project["generationStatus"],
    createdAt: String(row.createdAt),
    updatedAt: String(row.updatedAt)
  };
}

function createId() {
  return `proj_${crypto.randomUUID().replaceAll("-", "").slice(0, 24)}`;
}

export function listProjects(limit?: number) {
  const statement = limit
    ? db.prepare("SELECT * FROM projects ORDER BY updatedAt DESC LIMIT ?")
    : db.prepare("SELECT * FROM projects ORDER BY updatedAt DESC");
  const rows = limit ? statement.all(limit) : statement.all();
  return rows.map((row) => rowToProject(row as Record<string, unknown>));
}

export function getProjectById(id: string) {
  const row = db
    .prepare("SELECT * FROM projects WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;

  return row ? rowToProject(row) : null;
}

export function countProjects() {
  const row = db.prepare("SELECT COUNT(*) as count FROM projects").get() as { count: number };
  return row.count;
}

export function createProject(data: {
  name: string;
  description: string;
  domain?: string | null;
}) {
  const now = new Date().toISOString();
  const project: Project = {
    id: createId(),
    name: data.name,
    description: data.description,
    domain: data.domain ?? null,
    businessProblem: "",
    businessTargetUsers: "",
    businessGoal: "",
    businessOutcome: "",
    businessKpis: "",
    businessPainPoints: "",
    businessConstraints: "",
    businessTimeline: "",
    businessBudget: "",
    functionalWorkflows: "",
    functionalActions: "",
    functionalSystems: "",
    functionalIntegrations: "",
    functionalDataSources: "",
    functionalRequirements: "",
    nonFunctionalRequirements: "",
    functionalAssumptions: "",
    functionalRisks: "",
    spec: "",
    codeApproach: "",
    securityGuardrails: "",
    testStrategy: "",
    productionPlan: "",
    measurePlan: "",
    improveRoadmap: "",
    maturityModel: "",
    agileMapping: "",
    generationStatus: "draft",
    createdAt: now,
    updatedAt: now
  };

  db.prepare(
    `INSERT INTO projects (
      id, name, description, domain, businessProblem, businessTargetUsers, businessGoal,
      businessOutcome, businessKpis, businessPainPoints, businessConstraints,
      businessTimeline, businessBudget, functionalWorkflows, functionalActions,
      functionalSystems, functionalIntegrations, functionalDataSources,
      functionalRequirements, nonFunctionalRequirements, functionalAssumptions,
      functionalRisks, spec, codeApproach, securityGuardrails, testStrategy,
      productionPlan, measurePlan, improveRoadmap, maturityModel, agileMapping,
      generationStatus, createdAt, updatedAt
    ) VALUES (
      @id, @name, @description, @domain, @businessProblem, @businessTargetUsers, @businessGoal,
      @businessOutcome, @businessKpis, @businessPainPoints, @businessConstraints,
      @businessTimeline, @businessBudget, @functionalWorkflows, @functionalActions,
      @functionalSystems, @functionalIntegrations, @functionalDataSources,
      @functionalRequirements, @nonFunctionalRequirements, @functionalAssumptions,
      @functionalRisks, @spec, @codeApproach, @securityGuardrails, @testStrategy,
      @productionPlan, @measurePlan, @improveRoadmap, @maturityModel, @agileMapping,
      @generationStatus, @createdAt, @updatedAt
    )`
  ).run(project);

  return project;
}

export function updateProject(id: string, changes: Partial<Project>) {
  const existing = getProjectById(id);
  if (!existing) {
    return null;
  }

  const nextProject: Project = {
    ...existing,
    ...changes,
    id,
    updatedAt: new Date().toISOString()
  };

  db.prepare(
    `UPDATE projects SET
      name = @name,
      description = @description,
      domain = @domain,
      businessProblem = @businessProblem,
      businessTargetUsers = @businessTargetUsers,
      businessGoal = @businessGoal,
      businessOutcome = @businessOutcome,
      businessKpis = @businessKpis,
      businessPainPoints = @businessPainPoints,
      businessConstraints = @businessConstraints,
      businessTimeline = @businessTimeline,
      businessBudget = @businessBudget,
      functionalWorkflows = @functionalWorkflows,
      functionalActions = @functionalActions,
      functionalSystems = @functionalSystems,
      functionalIntegrations = @functionalIntegrations,
      functionalDataSources = @functionalDataSources,
      functionalRequirements = @functionalRequirements,
      nonFunctionalRequirements = @nonFunctionalRequirements,
      functionalAssumptions = @functionalAssumptions,
      functionalRisks = @functionalRisks,
      spec = @spec,
      codeApproach = @codeApproach,
      securityGuardrails = @securityGuardrails,
      testStrategy = @testStrategy,
      productionPlan = @productionPlan,
      measurePlan = @measurePlan,
      improveRoadmap = @improveRoadmap,
      maturityModel = @maturityModel,
      agileMapping = @agileMapping,
      generationStatus = @generationStatus,
      updatedAt = @updatedAt
    WHERE id = @id`
  ).run(Object.fromEntries(Object.entries(nextProject).filter(([key]) => key !== "createdAt")));

  return nextProject;
}

export function deleteAllProjects() {
  db.exec("DELETE FROM projects");
}
