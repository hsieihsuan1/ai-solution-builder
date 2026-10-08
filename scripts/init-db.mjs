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

console.log(`SQLite database initialized at ${databasePath}.`);
