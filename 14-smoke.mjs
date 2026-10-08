import assert from "node:assert/strict";
const base = "http://127.0.0.1:3000";
let checks=0;
async function call(path, method="GET", payload, status=200) {
 const res = await fetch(base+path,{method,headers:{"Content-Type":"application/json"},body:payload===undefined?undefined:JSON.stringify(payload)});
 assert.equal(res.status,status,`${method} ${path}`);checks++;return res.json();
}
await call("/api/projects","POST",null,400);
await call("/api/projects","POST",{name:"Only name"},400);
const {project:p}=await call("/api/projects","POST",{name:"Synthetic Smoke",description:"Invented API test"},201);
await call(`/api/projects/${p.id}/generate`,"POST",undefined,400);
const inputs={...p,businessProblem:"Invented queue",businessTargetUsers:"Demo analysts",businessGoal:"Draft review",functionalWorkflows:"Review requests",functionalRequirements:"Editable drafts"};
delete inputs.domain;
await call(`/api/projects/${p.id}`,"PATCH",inputs);
const g=await call(`/api/projects/${p.id}/generate`,"POST");assert.equal(g.mode,"mock");assert.match(g.project.spec,/Invented queue/);checks++;
const r=await call(`/api/projects/${p.id}`);assert.equal(r.project.generationStatus,"mock");checks++;
await call(`/api/projects/${p.id}`,"PATCH",{...inputs,spec:"Human edited synthetic draft"});
const edited=await call(`/api/projects/${p.id}`);assert.equal(edited.project.spec,"Human edited synthetic draft");assert.equal(edited.project.generationStatus,"mock");checks++;
await call("/api/projects/missing","GET",undefined,404);
const raw=await fetch(base+"/api/projects",{method:"POST",body:"{"});assert.equal(raw.status,400);checks++;
console.log(`${checks} API smoke assertions passed`);
