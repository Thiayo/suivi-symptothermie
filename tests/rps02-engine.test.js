import test from "node:test";
import assert from "node:assert/strict";
import { fahrenheitToCelsius, evaluateThermal, evaluateCervical, evaluateDoubleCheck, evaluateCycle, getTutorMessage } from "../src/rps02-engine.mjs";

const obs=(date,temp,extra={})=>({date,tempC:temp,...extra});
const mucus=(date,value)=>({date,mucus:value});
function lowSeries(values,start="2026-01-01"){
  return values.map((t,i)=>obs(new Date(Date.parse(start+"T00:00:00Z")+i*86400000).toISOString().slice(0,10),t));
}

test("T01 empty cycle => NO_DATA",()=>assert.equal(evaluateCycle([]).state,"NO_DATA"));
test("T02 fewer than six usable temperatures => INSUFFICIENT_DATA",()=>assert.equal(evaluateThermal(lowSeries([36.3,36.2,36.4,36.3,36.2])).status,"INSUFFICIENT_DATA"));
test("T03 six lows without rise => NO_SHIFT",()=>assert.equal(evaluateThermal(lowSeries([36.2,36.3,36.1,36.3,36.2,36.4,36.3])).status,"NO_SHIFT"));
test("T04 three highs below +0.20 => candidate",()=>{
  const r=evaluateThermal(lowSeries([36.2,36.3,36.1,36.2,36.3,36.2,36.45,36.5,36.4]));
  assert.equal(r.status,"THERMAL_RISE_CANDIDATE");
});
test("T05 fourth high completes the rise",()=>{
  const r=evaluateThermal(lowSeries([36.2,36.3,36.1,36.2,36.3,36.2,36.45,36.5,36.4,36.6]));
  assert.equal(r.status,"SHIFT_CONFIRMED"); assert.equal(r.exception,"FOURTH_VALUE");
});
test("T06 three highs with third >= +0.20 confirms",()=>{
  const r=evaluateThermal(lowSeries([36.2,36.3,36.1,36.2,36.3,36.2,36.45,36.55,36.65]));
  assert.equal(r.status,"SHIFT_CONFIRMED"); assert.equal(r.qualifyingDates.length,3);
});
test("T07 third high below +0.20 does not confirm without valid fourth",()=>{
  const r=evaluateThermal(lowSeries([36.2,36.3,36.1,36.2,36.3,36.2,36.45,36.5,36.4,36.2]));
  assert.notEqual(r.status,"SHIFT_CONFIRMED");
});
test("T08 disturbed value is preserved but excluded",()=>{
  const values=lowSeries([36.2,36.3,36.1,36.2,36.3,36.2,36.45,36.55,36.65,36.7]);
  values[2].temperatureQuality="disturbed";
  const r=evaluateThermal(values); assert.equal(r.disturbedDates.length,1); assert.equal(r.status,"SHIFT_CONFIRMED");
});
test("T09 disturbed value after confirmed shift does not erase confirmation",()=>{
  const values=lowSeries([36.2,36.3,36.1,36.2,36.3,36.2,36.45,36.55,36.65,38]);
  values.at(-1).temperatureQuality="disturbed"; assert.equal(evaluateThermal(values).status,"SHIFT_CONFIRMED");
});
test("T10 Fahrenheit conversion",()=>assert.equal(Math.round(fahrenheitToCelsius(98.6)*10)/10,37));
test("T11 no cervical observations => NO_DATA",()=>assert.equal(evaluateCervical([]).status,"NO_DATA"));
test("T12 cervical observations remain observational",()=>{
  const r=evaluateCervical([mucus("2026-01-01","sec"),mucus("2026-01-02","cremeuse")]);
  assert.equal(r.status,"PEAK_IDENTIFIED"); assert.equal(r.adaptationStatus,"PENDING_EXPERT_REVIEW");
});
test("T13 cervical transition identifies provisional Peak",()=>{
  const r=evaluateCervical([mucus("2026-01-01","sec"),mucus("2026-01-02","cremeuse"),mucus("2026-01-03","blanc-oeuf")]);
  assert.equal(r.status,"PEAK_IDENTIFIED"); assert.equal(r.peakDate,"2026-01-03");
});
test("T14 Peak +1 is not complete",()=>{
  const r=evaluateCervical([mucus("2026-01-01","sec"),mucus("2026-01-02","blanc-oeuf"),mucus("2026-01-03","cremeuse")]);
  assert.equal(r.status,"PEAK_IDENTIFIED");
});
test("T15 Peak +2 is not complete",()=>{
  const r=evaluateCervical([mucus("2026-01-01","sec"),mucus("2026-01-02","blanc-oeuf"),mucus("2026-01-04","cremeuse")]);
  assert.equal(r.status,"PEAK_IDENTIFIED");
});
test("T16 Peak +3 completes after three calendar days",()=>{
  const r=evaluateCervical([mucus("2026-01-01","sec"),mucus("2026-01-02","blanc-oeuf"),mucus("2026-01-05","cremeuse")]);
  assert.equal(r.status,"PEAK_PLUS_3_COMPLETED"); assert.equal(r.peakPlusThreeDate,"2026-01-05");
});
test("T17 a later strictly higher observation resets the provisional Peak",()=>{
  const r=evaluateCervical([mucus("2026-01-01","sec"),mucus("2026-01-02","cremeuse"),mucus("2026-01-03","sec"),mucus("2026-01-04","blanc-oeuf")]);
  assert.equal(r.peakDate,"2026-01-04"); assert.ok(r.resetDates.includes("2026-01-04"));
});
test("T18 double-check waits when cervical is pending",()=>{
  const r=evaluateDoubleCheck({status:"SHIFT_CONFIRMED",confirmationDate:"2026-01-10"},{status:"PEAK_IDENTIFIED",peakPlusThreeDate:"2026-01-08"});
  assert.equal(r.status,"DOUBLE_CHECK_PENDING");
});
test("T19 double-check waits when thermal is pending",()=>{
  const r=evaluateDoubleCheck({status:"THERMAL_RISE_CANDIDATE"},{status:"PEAK_PLUS_3_COMPLETED",peakPlusThreeDate:"2026-01-08"});
  assert.equal(r.status,"DOUBLE_CHECK_PENDING");
});
test("T20 both criteria complete",()=>{
  const r=evaluateDoubleCheck({status:"SHIFT_CONFIRMED",confirmationDate:"2026-01-10"},{status:"PEAK_PLUS_3_COMPLETED",peakPlusThreeDate:"2026-01-09"});
  assert.equal(r.status,"DOUBLE_CHECK_COMPLETE"); assert.equal(r.completionDate,"2026-01-10");
});
test("T21 later criterion is thermal",()=>{
  const r=evaluateDoubleCheck({status:"SHIFT_CONFIRMED",confirmationDate:"2026-01-12"},{status:"PEAK_PLUS_3_COMPLETED",peakPlusThreeDate:"2026-01-10"});
  assert.equal(r.completionDate,"2026-01-12");
});
test("T22 later criterion is cervical",()=>{
  const r=evaluateDoubleCheck({status:"SHIFT_CONFIRMED",confirmationDate:"2026-01-10"},{status:"PEAK_PLUS_3_COMPLETED",peakPlusThreeDate:"2026-01-12"});
  assert.equal(r.completionDate,"2026-01-12");
});
test("T23 missing temperature is not a low temperature",()=>{
  const r=evaluateThermal(lowSeries([36.2,36.3,36.1,36.2,36.3,36.2]).concat(obs("2026-01-07",null)));
  assert.equal(r.status,"NO_SHIFT");
});
test("T24 measurement metadata does not alter raw value",()=>{
  const values=lowSeries([36.2,36.3,36.1,36.2,36.3,36.2,36.45,36.55,36.65]);
  values[8].measurementTime="10:30"; assert.equal(evaluateThermal(values).status,"SHIFT_CONFIRMED");
});
test("T25 fever-marked temperature is excluded",()=>{
  const values=lowSeries([36.2,36.3,36.1,36.2,36.3,36.2,38.5,36.55,36.65]);
  values[6].temperatureQuality="disturbed"; assert.notEqual(evaluateThermal(values).status,"SHIFT_CONFIRMED");
});
test("T26 Fahrenheit round-trip is stable",()=>{
  const c=37.05,f=c*9/5+32; assert.ok(Math.abs(fahrenheitToCelsius(f)-c)<1e-10);
});
test("T27 historical modification recalculates",()=>{
  const a=lowSeries([36.2,36.3,36.1,36.2,36.3,36.2,36.45,36.55,36.65]);
  const b=a.map(x=>({...x})); b[8].tempC=36.2;
  assert.equal(evaluateCycle(a).thermal.status,"SHIFT_CONFIRMED"); assert.notEqual(evaluateCycle(b).thermal.status,"SHIFT_CONFIRMED");
});
test("T28 deletion removes confirmation",()=>{
  const a=lowSeries([36.2,36.3,36.1,36.2,36.3,36.2,36.45,36.55,36.65]);
  assert.equal(evaluateThermal(a).status,"SHIFT_CONFIRMED"); assert.notEqual(evaluateThermal(a.slice(0,8)).status,"SHIFT_CONFIRMED");
});
test("T29 imported observations are deterministic",()=>{
  const a=lowSeries([36.2,36.3,36.1,36.2,36.3,36.2,36.45,36.55,36.65]);
  assert.deepEqual(evaluateCycle(a),evaluateCycle(JSON.parse(JSON.stringify(a))));
});
test("T30 export/import semantic equivalence",()=>{
  const a=lowSeries([36.2,36.3,36.1,36.2,36.3,36.2,36.45,36.55,36.65]);
  assert.deepEqual(evaluateCycle(a),evaluateCycle(JSON.parse(JSON.stringify(a))));
});
test("T31 one ignored low/on-line value is allowed",()=>{
  const a=lowSeries([36.2,36.3,36.1,36.2,36.3,36.2,36.45,36.2,36.55,36.65]);
  const r=evaluateThermal(a); assert.equal(r.status,"SHIFT_CONFIRMED"); assert.equal(r.exception,"IGNORED_LOW_VALUE");
});
test("T32 two cycles are independent",()=>{
  const a=lowSeries([36.2,36.3,36.1,36.2,36.3,36.2,36.45,36.55,36.65]);
  const b=lowSeries([36.2,36.3,36.1,36.2,36.3,36.2]);
  assert.equal(evaluateCycle(a).thermal.status,"SHIFT_CONFIRMED"); assert.equal(evaluateCycle(b).thermal.status,"NO_SHIFT");
});
test("T33 contradictory cervical pattern remains descriptive",()=>{
  const r=evaluateCervical([mucus("2026-01-01","blanc-oeuf"),mucus("2026-01-02","sec"),mucus("2026-01-03","blanc-oeuf")]);
  assert.equal(r.adaptationStatus,"PENDING_EXPERT_REVIEW");
});
test("T34 tutor never claims ovulation or contraceptive safety",()=>{
  const messages=["NO_DATA","DISTURBED","THERMAL_RISE_CANDIDATE","CERVICAL_TRANSITION","DOUBLE_CHECK_PENDING","DOUBLE_CHECK_COMPLETE","UNRESOLVED"].map(s=>getTutorMessage(s,"fr")).join(" ").toLowerCase();
  for(const forbidden of ["ovulation confirmée","infertile","jour sûr","jour dangereux","protégée","contraception confirmée"]) assert.equal(messages.includes(forbidden),false);
});

test("P01 disturbed values never qualify",()=>{
  const a=lowSeries([36.2,36.3,36.1,36.2,36.3,36.2,38.5,38.6,38.7]);
  a.slice(6).forEach(x=>x.temperatureQuality="disturbed"); assert.equal(evaluateThermal(a).status,"NO_SHIFT");
});
test("P02 evaluation does not mutate raw observations",()=>{
  const a=lowSeries([36.2,36.3,36.1,36.2,36.3,36.2,36.45,36.55,36.65]); const before=JSON.stringify(a);
  evaluateCycle(a); assert.equal(JSON.stringify(a),before);
});
test("P03 engine is deterministic",()=>{
  const a=lowSeries([36.2,36.3,36.1,36.2,36.3,36.2,36.45,36.55,36.65]);
  assert.deepEqual(evaluateCycle(a),evaluateCycle(a));
});
test("P04 language is not an engine input",()=>{
  const a=lowSeries([36.2,36.3,36.1,36.2,36.3,36.2,36.45,36.55,36.65]);
  assert.equal(evaluateCycle(a).thermal.status,evaluateCycle(a).thermal.status);
});
test("P05 missing dates do not create synthetic temperatures",()=>{
  const a=lowSeries([36.2,36.3,36.1,36.2,36.3,36.2,36.45,36.55]);
  a.push({date:"2026-01-20",mucus:"blanc-oeuf"}); assert.equal(evaluateThermal(a).status,"THERMAL_RISE_CANDIDATE");
});
test("P06 tutor output is externalized",()=>assert.equal(typeof getTutorMessage(evaluateCycle([]).state),"string"));
test("P07 engine exposes no contraceptive state",()=>assert.equal(Object.keys(evaluateCycle([])).includes("contraceptive"),false));
