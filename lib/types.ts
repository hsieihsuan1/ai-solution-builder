export type ProjectFormData = {
  businessProblem: string;
  businessTargetUsers: string;
  businessGoal: string;
  businessOutcome: string;
  businessKpis: string;
  businessPainPoints: string;
  businessConstraints: string;
  businessTimeline: string;
  businessBudget: string;
  functionalWorkflows: string;
  functionalActions: string;
  functionalSystems: string;
  functionalIntegrations: string;
  functionalDataSources: string;
  functionalRequirements: string;
  nonFunctionalRequirements: string;
  functionalAssumptions: string;
  functionalRisks: string;
};

export type Project = ProjectFormData & {
  id: string;
  name: string;
  description: string;
  domain: string | null;
  spec: string;
  codeApproach: string;
  securityGuardrails: string;
  testStrategy: string;
  productionPlan: string;
  measurePlan: string;
  improveRoadmap: string;
  maturityModel: string;
  agileMapping: string;
  generationStatus: "draft" | "generated" | "mock";
  createdAt: string;
  updatedAt: string;
};

export type GeneratedSections = {
  spec: string;
  codeApproach: string;
  securityGuardrails: string;
  testStrategy: string;
  productionPlan: string;
  measurePlan: string;
  improveRoadmap: string;
  maturityModel: string;
  agileMapping: string;
};
