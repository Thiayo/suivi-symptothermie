import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { evaluateCervical } from "../src/rps02-engine.mjs";

const corpus=JSON.parse(readFileSync(new URL("./fixtures/rps02-cervical-corpus.json",import.meta.url)));
test("corpus fixture is validation-only",()=>assert.equal(corpus.status,"VALIDATION_ONLY"));
test("all 24 cervical corpus cases have explicit pending gold status",()=> {
  assert.equal(corpus.cases.length,24);
  for (const c of corpus.cases) assert.equal(c.goldStatus,"pending_expert");
});
test("engine conforms to every corpus expected status",()=> {
  for (const c of corpus.cases) {
    const input=c.rawValue===null ? [] : [{date:"2026-01-01",rawValue:c.rawValue,context:c.context}];
    const result=evaluateCervical(input);
    assert.equal(result.status,c.expectedEngine,c.caseId);
    if (input.length) {
      assert.equal(result.interpretationBlocked,true,c.caseId);
      assert.equal(result.peakDate,null,c.caseId);
      assert.equal(result.peakPlusThreeDate,null,c.caseId);
    }
  }
});
