import { NextResponse } from "next/server";

import { getProjectById, updateProject } from "@/lib/db";
import { generateProjectSections } from "@/lib/llm";
import { validateGenerationEligibility } from "@/lib/validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const project = getProjectById(id);

  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const validation = validateGenerationEligibility(project as unknown as Record<string, unknown>);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.message }, { status: 400 });
  }

  const generated = await generateProjectSections(project);

  const updatedProject = updateProject(id, {
    ...generated.sections,
    generationStatus: "mock"
  });

  if (!updatedProject) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json({
    mode: generated.mode,
    project: {
      spec: updatedProject.spec,
      codeApproach: updatedProject.codeApproach,
      securityGuardrails: updatedProject.securityGuardrails,
      testStrategy: updatedProject.testStrategy,
      productionPlan: updatedProject.productionPlan,
      measurePlan: updatedProject.measurePlan,
      improveRoadmap: updatedProject.improveRoadmap,
      maturityModel: updatedProject.maturityModel,
      agileMapping: updatedProject.agileMapping
    }
  });
}
