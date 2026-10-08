import { Project } from "@/lib/types";

export const editableSectionLabels: Record<string, string> = {
  spec: "Spec",
  codeApproach: "Code",
  securityGuardrails: "Security / Guardrails",
  testStrategy: "Test",
  productionPlan: "Production",
  measurePlan: "Measure",
  improveRoadmap: "Improve",
  maturityModel: "Crawl / Walk / Run / Fly",
  agileMapping: "Agile Mapping"
};

export const textAreaRows: Record<string, number> = {
  description: 3,
  businessProblem: 4,
  businessTargetUsers: 3,
  businessGoal: 3,
  businessOutcome: 3,
  businessKpis: 3,
  businessPainPoints: 4,
  businessConstraints: 3,
  businessTimeline: 2,
  businessBudget: 2,
  functionalWorkflows: 4,
  functionalActions: 3,
  functionalSystems: 3,
  functionalIntegrations: 3,
  functionalDataSources: 3,
  functionalRequirements: 4,
  nonFunctionalRequirements: 3,
  functionalAssumptions: 3,
  functionalRisks: 3
};

export function getProjectInputSummary(project: Project) {
  return {
    business: {
      problemStatement: project.businessProblem,
      targetUsers: project.businessTargetUsers,
      businessGoal: project.businessGoal,
      expectedOutcome: project.businessOutcome,
      successMetrics: project.businessKpis,
      painPoints: project.businessPainPoints,
      constraints: project.businessConstraints,
      timeline: project.businessTimeline,
      investmentExpectation: project.businessBudget
    },
    functional: {
      keyWorkflows: project.functionalWorkflows,
      userActions: project.functionalActions,
      systemsInvolved: project.functionalSystems,
      integrationsNeeded: project.functionalIntegrations,
      dataSources: project.functionalDataSources,
      functionalRequirements: project.functionalRequirements,
      nonFunctionalRequirements: project.nonFunctionalRequirements,
      assumptions: project.functionalAssumptions,
      risks: project.functionalRisks
    }
  };
}
