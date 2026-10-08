import test from "node:test";
import assert from "node:assert/strict";
import {validateProjectCreation, validateGenerationEligibility, validatePayload} from "../lib/validation";
import {generateProjectSections} from "../lib/llm";
import type {Project} from "../lib/types";
test("valid create", () => assert.equal(validateProjectCreation({name:"Synthetic",description:"Demo"}).valid,true));
for (const payload of [null, [], "bad", {name:"",description:"D"}, {name:"x".repeat(201),description:"D"},{name:"S",description:42}]) {
 test(`reject bad create ${JSON.stringify(payload).slice(0,40)}`, () => assert.equal(validateProjectCreation(payload as never).valid,false));
}
test("reject oversized field", () => assert.equal(validatePayload({spec:"x".repeat(12001)}).valid,false));
test("generation essentials required", () => assert.equal(validateGenerationEligibility({}).valid,false));
test("local template uses inputs without network", async () => {
 const before = globalThis.fetch; globalThis.fetch = () => {throw Error("Unexpected network call");};
 try {
 const project = {name:"Synthetic",businessProblem:"Invented stock issue",businessTargetUsers:"Demo analysts",businessGoal:"Test draft flow",functionalWorkflows:"Review a draft",functionalRequirements:"Editable output"} as Project;
 const generated = await generateProjectSections(project);
 assert.equal(generated.mode,"mock");assert.equal(Object.keys(generated.sections).length,9);
 assert.match(generated.sections.spec,/Invented stock issue/);
 for(const value of Object.values(generated.sections)) assert.match(value,/LOCAL TEMPLATE DRAFT/);
 assert.match(generated.sections.productionPlan,/Not production-ready/);
 } finally {globalThis.fetch = before;}
});
