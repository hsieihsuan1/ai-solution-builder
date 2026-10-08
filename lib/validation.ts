type ValidationResult = { valid: boolean; message?: string };
export function validatePayload(payload: unknown): ValidationResult {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return {valid:false,message:"Expected a JSON object."};
  const values = Object.values(payload);
  if (values.length > 40 || values.some(v => typeof v !== "string" || v.length > 12000)) return {valid:false,message:"Fields must be text up to 12000 characters."};
  return {valid:true};
}
function hasValue(value: unknown) { return typeof value === "string" && value.trim().length > 0; }
export function validateProjectCreation(payload: Record<string, unknown>): ValidationResult {
  const shape = validatePayload(payload); if (!shape.valid) return shape;
  if (!hasValue(payload.name) || String(payload.name).length > 200) return {valid:false,message:"Project name is required (maximum 200 characters)."};
  if (!hasValue(payload.description)) return {valid:false,message:"Project description is required."};
  return {valid:true};
}
export function validateGenerationEligibility(payload: Record<string, unknown>): ValidationResult {
  for (const field of ["businessProblem","businessTargetUsers","businessGoal","functionalWorkflows","functionalRequirements"]) {
    if (!hasValue(payload[field])) return {valid:false,message:"Complete the essential Business and Functional fields before generating."};
  }
  return {valid:true};
}
