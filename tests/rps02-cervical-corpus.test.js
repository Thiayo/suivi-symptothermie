import test from "node:test";
import assert from "node:assert/strict";
import { evaluateCervical } from "../src/rps02-engine.mjs";

test("corpus: no observation => NO_DATA",()=>{
  assert.equal(evaluateCervical([]).status,"NO_DATA");
});
test("corpus: any cervical observation remains blocked",()=>{
  const cases=[
    {date:"2026-01-01",rawValue:"sec"},
    {date:"2026-01-02",sensation:"moist",appearance:"creamy"},
    {date:"2026-01-03",sensation:"slippery",appearance:"glassy",amount:"large"},
    {date:"2026-01-04",context:"postpartum",rawValue:"observation"},
    {date:"2026-01-05",context:"infection_suspected",rawValue:"observation"},
    {date:"2026-01-06",rawValue:"white egg"},
  ];
  for (const c of cases) {
    const r=evaluateCervical([c]);
    assert.equal(r.status,"PENDING_EXPERT_REVIEW");
    assert.equal(r.interpretationBlocked,true);
    assert.equal(r.peakDate,null);
    assert.equal(r.peakPlusThreeDate,null);
  }
});
test("corpus: raw fields are preserved",()=>{
  const input={date:"2026-02-01",rawValue:"terme local",sensation:"unknown",appearance:"other",quality:"uncertain",source:"user"};
  const r=evaluateCervical([input]);
  assert.equal(r.observations[0].rawValue,"terme local");
  assert.equal(r.observations[0].source,"user");
  assert.equal(r.observations[0].appearance,"other");
});
test("corpus: order is deterministic",()=>{
  const input=[
    {date:"2026-03-03",rawValue:"b"},
    {date:"2026-03-01",rawValue:"a"},
    {date:"2026-03-02",rawValue:"c"}
  ];
  const r=evaluateCervical(input);
  assert.deepEqual(r.observations.map(x=>x.date),["2026-03-01","2026-03-02","2026-03-03"]);
});
