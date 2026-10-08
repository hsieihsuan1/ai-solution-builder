import { NextResponse } from "next/server";

import { createProject, listProjects } from "@/lib/db";
import { validateProjectCreation } from "@/lib/validation";

export async function GET() {
  const projects = listProjects();

  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try { payload = await request.json(); } catch { return NextResponse.json({error: "Invalid JSON."}, {status: 400}); }
  const validation = validateProjectCreation(payload);

  if (!validation.valid) {
    return NextResponse.json({ error: validation.message }, { status: 400 });
  }

  const project = createProject({
    name: String(payload.name),
    description: String(payload.description),
    domain: payload.domain ? String(payload.domain) : null
  });

  return NextResponse.json({ project }, { status: 201 });
}
