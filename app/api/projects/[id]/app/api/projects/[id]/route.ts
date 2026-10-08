import { NextResponse } from "next/server";

import { getProjectById, updateProject } from "@/lib/db";
import { validateProjectCreation } from "@/lib/validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const project = getProjectById(id);

  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json({ project });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const existingProject = getProjectById(id);

  if (!existingProject) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  let payload: Record<string, unknown>;
  try { payload = await request.json(); } catch { return NextResponse.json({error: "Invalid JSON."}, {status: 400}); }
  const validation = validateProjectCreation(payload);

  if (!validation.valid) {
    return NextResponse.json({ error: validation.message }, { status: 400 });
  }

  const project = updateProject(id, {
    name: String(payload.name),
    description: String(payload.description),
    domain: payload.domain ? String(payload.domain) : null,
    businessProblem: String(payload.businessProblem ?? ""),
    businessTargetUsers: String(payload.businessTargetUsers ?? ""),
    businessGoal: String(payload.businessGoal ?? ""),
    businessOutcome: String(payload.businessOutcome ?? ""),
    businessKpis: String(payload.businessKpis ?? ""),
    businessPainPoints: String(payload.businessPainPoints ?? ""),
    businessConstraints: String(payload.businessConstraints ?? ""),
    businessTimeline: String(payload.businessTimeline ?? ""),
    businessBudget: String(payload.businessBudget ?? ""),
    functionalWorkflows: String(payload.functionalWorkflows ?? ""),
    functionalActions: String(payload.functionalActions ?? ""),
    functionalSystems: String(payload.functionalSystems ?? ""),
    functionalIntegrations: String(payload.functionalIntegrations ?? ""),
    functionalDataSources: String(payload.functionalDataSources ?? ""),
    functionalRequirements: String(payload.functionalRequirements ?? ""),
    nonFunctionalRequirements: String(payload.nonFunctionalRequirements ?? ""),
    functionalAssumptions: String(payload.functionalAssumptions ?? ""),
    functionalRisks: String(payload.functionalRisks ?? ""),
    spec: String(payload.spec ?? ""),
    codeApproach: String(payload.codeApproach ?? ""),
    securityGuardrails: String(payload.securityGuardrails ?? ""),
    testStrategy: String(payload.testStrategy ?? ""),
    productionPlan: String(payload.productionPlan ?? ""),
    measurePlan: String(payload.measurePlan ?? ""),
    improveRoadmap: String(payload.improveRoadmap ?? ""),
    maturityModel: String(payload.maturityModel ?? ""),
    agileMapping: String(payload.agileMapping ?? ""),
    generationStatus:
      existingProject.generationStatus
  });

  return NextResponse.json({ project });
}
