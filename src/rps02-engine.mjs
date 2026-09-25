/**
 * RPS-02 / SymRella executable engine v0.2
 *
 * SOURCE_RULES are separated from SYMR_ADAPTATIONS.
 * S01: AWMF/DGGG S2k 015-095, section 1.5/1.9.
 * S02: Sensiplan official method/FAQ pages.
 *
 * Descriptive engine only: no diagnosis and no contraceptive conclusion.
 */

export const RPS02_VERSION = "0.2.0";

export const TRACE = Object.freeze({
  R01: { kind:"SOURCE_RULE", source:"S01", code:"thermal.sixReferenceValues", tests:["T03","T06","T08"] },
  R02: { kind:"SOURCE_RULE", source:"S01", code:"thermal.threeHigherValues", tests:["T06"] },
  R03: { kind:"SOURCE_RULE", source:"S01", code:"thermal.plusTwoTenths", tests:["T06","T07"] },
  R04: { kind:"SOURCE_RULE", source:"S01", code:"thermal.exceptionFourthValue", tests:["T05"] },
  R05: { kind:"SOURCE_RULE", source:"S01", code:"thermal.exceptionIgnoredLow", tests:["T31"] },
  R06: { kind:"SOURCE_RULE", source:"S01", code:"cervical.peak", tests:["T13","T17"] },
  R07: { kind:"SOURCE_RULE", source:"S01", code:"cervical.peakPlusThree", tests:["T14","T15","T16"] },
  R08: { kind:"SOURCE_RULE", source:"S01", code:"doubleCheck.laterCriterion", tests:["T18","T19","T20","T21","T22"] },
  R09: { kind:"SYMR_ADAPTATION", source:"SymRella", code:"descriptiveStates", tests:["T01","T02","T34"] },
  R10: { kind:"SYMR_ADAPTATION", source:"SymRella", code:"noDiagnosticConclusions", tests:["T34"] },
  R11: { kind:"SYMR_ADAPTATION", source:"SymRella", code:"rawObservationsPreserved", tests:["T08","T27","T30"] },
  R12: { kind:"IMPLEMENTATION", source:"calculation", code:"fahrenheitToCelsius", tests:["T10","T26"] },
  R13: { kind:"SYMR_ADAPTATION", source:"RPS-02-CERVICAL v0.3", code:"cervical.interpretationBlocked", tests:["T12","T13","T14","T16","T17"] },
  R14: { kind:"VALIDATION_PROTOCOL", source:"RPS-02-CERVICAL-ANNOTATION v0.1", code:"annotation.independentReview", tests:["C01-C24"] },
  R15: { kind:"VALIDATION_PROTOCOL", source:"RPS-02-CERVICAL-ANNOTATION v0.1", code:"multilingual.invariance", tests:["C21","C22"] }
});

export function fahrenheitToCelsius(f) {
  const n=Number(f);
  return Number.isFinite(n) ? (n-32)*5/9 : null;
}

export function celsiusToFahrenheit(c) {
  const n=Number(c);
  return Number.isFinite(n) ? n*9/5+32 : null;
}

function finite(v) { return Number.isFinite(Number(v)) ? Number(v) : null; }

function isDisturbed(o) {
  return o?.temperature?.quality==="disturbed" ||
    o?.temperatureQuality==="disturbed" ||
    o?.disturbed===true;
}

function tempValue(o) {
  if (!o) return null;
  if (o.temperature && typeof o.temperature==="object") {
    if (o.temperature.valueC!=null) return finite(o.temperature.valueC);
    if (o.temperature.value!=null) {
      const v=finite(o.temperature.value);
      return v==null ? null : (o.temperature.unit==="F" ? fahrenheitToCelsius(v) : v);
    }
  }
  if (o.tempC!=null) return finite(o.tempC);
  if (o.temp!=null) {
    const v=finite(o.temp);
    return v==null ? null : (o.unit==="F" ? fahrenheitToCelsius(v) : v);
  }
  return null;
}

function sortObservations(observations=[]) {
  return [...observations].filter(Boolean).sort((a,b)=>String(a.date).localeCompare(String(b.date)));
}

function result(status, ref=null, first=null, confirmation=null, qualifying=[], ignored=[], exception="NONE", disturbed=[]) {
  return {status, referenceLine:ref, firstHighDate:first, confirmationDate:confirmation, qualifyingDates:qualifying, ignoredDates:ignored, exception, disturbedDates:disturbed};
}

/**
 * SOURCE_RULE R05.
 * One low/on-line value may occur between the three required higher values.
 * It is ignored for the high-value count; the third qualifying high must still
 * reach reference + 0.20°C.
 */
function candidateWithIgnoredLow(values,start) {
  const six=values.slice(start-6,start);
  if (six.length!==6) return null;
  const ref=Math.max(...six.map(x=>x.value));
  const tail=values.slice(start,start+5);
  if (tail.length<3) return null;
  const highs=[];
  let ignored=null;
  for (const item of tail) {
    if (item.value>ref) {
      highs.push(item);
      if (highs.length===3) break;
    } else if (ignored===null) {
      ignored=item;
    } else {
      break;
    }
  }
  if (highs.length!==3 || highs[2].value<ref+0.20) return null;
  return {referenceLine:ref,highs,ignored};
}

export function evaluateThermal(observations=[]) {
  const sorted=sortObservations(observations);
  const disturbedDates=sorted.filter(isDisturbed).map(o=>o.date);
  const usable=sorted.map(o=>({observation:o,value:tempValue(o),disturbed:isDisturbed(o)}))
    .filter(x=>x.value!=null&&!x.disturbed);

  if (usable.length<6) return result("INSUFFICIENT_DATA",null,null,null,[],[],"NONE",disturbedDates);

  for (let i=6;i<usable.length;i++) {
    const six=usable.slice(i-6,i);
    const ref=Math.max(...six.map(x=>x.value));
    const h1=usable[i],h2=usable[i+1],h3=usable[i+2];

    if (!h1) break;
    if (h1.value<=ref) continue;
    if (!h2 || !h3) {
      return result("THERMAL_RISE_CANDIDATE",ref,h1.observation.date,null,
        [h1.observation.date,h2?.observation.date,h3?.observation.date].filter(Boolean),[],"NONE",disturbedDates);
    }

    if (h1.value>ref && h2.value>ref && h3.value>ref) {
      if (h3.value>=ref+0.20) {
        return result("SHIFT_CONFIRMED",ref,h1.observation.date,h3.observation.date,
          [h1.observation.date,h2.observation.date,h3.observation.date],[],"NONE",disturbedDates);
      }
      const h4=usable[i+3];
      if (h4 && h4.value>ref) {
        return result("SHIFT_CONFIRMED",ref,h1.observation.date,h4.observation.date,
          [h1.observation.date,h2.observation.date,h3.observation.date,h4.observation.date],[],"FOURTH_VALUE",disturbedDates);
      }
      return result("THERMAL_RISE_CANDIDATE",ref,h1.observation.date,null,
        [h1.observation.date,h2.observation.date,h3.observation.date],[],"NONE",disturbedDates);
    }

    const special=candidateWithIgnoredLow(usable,i);
    if (special) {
      return result("SHIFT_CONFIRMED",special.referenceLine,special.highs[0].observation.date,
        special.highs[2].observation.date,special.highs.map(x=>x.observation.date),
        special.ignored?[special.ignored.observation.date]:[],"IGNORED_LOW_VALUE",disturbedDates);
    }
  }

  return result("NO_SHIFT",null,null,null,[],[],"NONE",disturbedDates);
}

/**
 * Cervical observations are intentionally raw-only in RPS-02 v0.2.
 *
 * The current SymRella UI vocabulary is not sufficiently granular to claim
 * equivalence with the reference method's cervical taxonomy. Until an expert
 * validates a SymRella cervical ontology, this engine must not manufacture a
 * Peak from the four UI labels.
 */
export function evaluateCervical(observations=[]) {
  const sorted=sortObservations(observations);
  const rawObservations=sorted.map(o=>({
    date:o.date,
    rawValue:o?.cervical?.rawValue ?? o?.cervical?.value ?? o?.rawValue ?? o?.mucus ?? null,
    sensation:o?.cervical?.sensation ?? o?.sensation,
    appearance:o?.cervical?.appearance ?? o?.appearance,
    quality:o?.cervical?.quality ?? o?.quality,
    amount:o?.cervical?.amount ?? o?.amount,
    context:o?.cervical?.context ?? o?.context,
    language:o?.cervical?.language ?? o?.language,
    notes:o?.cervical?.notes ?? o?.notes,
    source:o?.cervical?.source ?? o?.source ?? "ui"
  }));
  const observed=rawObservations.filter(x=>x.rawValue!=null);
  if (!observed.length) {
    return {
      status:"NO_DATA",
      observations:[],
      peakDate:null,
      peakPlusThreeDate:null,
      qualitySequence:[],
      resetDates:[],
      rawObservations,
      adaptationStatus:"PENDING_EXPERT_REVIEW", interpretationBlocked:true
    };
  }
  return {
    status:"PENDING_EXPERT_REVIEW",
    peakDate:null,
    peakPlusThreeDate:null,
    qualitySequence:[],
    resetDates:[],
    rawObservations,
    adaptationStatus:"PENDING_EXPERT_REVIEW",
    interpretationBlocked:true
  };
}

export function evaluateDoubleCheck(thermal,cervical) {
  const thermalComplete=thermal?.status==="SHIFT_CONFIRMED";
  const cervicalComplete=cervical?.status==="PEAK_PLUS_3_COMPLETED";
  if (!thermalComplete || !cervicalComplete) {
    return {status:"DOUBLE_CHECK_PENDING",completionDate:null,
      reason:thermalComplete ? "CERVICAL_PENDING" : cervicalComplete ? "THERMAL_PENDING" : "BOTH_PENDING"};
  }
  const dates=[thermal.confirmationDate,cervical.peakPlusThreeDate].filter(Boolean).sort();
  return {status:"DOUBLE_CHECK_COMPLETE",completionDate:dates.at(-1)??null,reason:"BOTH_CRITERIA_COMPLETE"};
}

export function evaluateCycle(observations=[]) {
  const sorted=sortObservations(observations);
  if (!sorted.length) {
    const thermal=evaluateThermal([]);
    const cervical=evaluateCervical([]);
    return {version:RPS02_VERSION,state:"NO_DATA",thermal,cervical,doubleCheck:evaluateDoubleCheck(thermal,cervical)};
  }
  const thermal=evaluateThermal(sorted);
  const cervical=evaluateCervical(sorted);
  const doubleCheck=evaluateDoubleCheck(thermal,cervical);
  let state="OBSERVING";
  if (thermal.status==="THERMAL_RISE_CANDIDATE") state="THERMAL_RISE_CANDIDATE";
  else if (cervical.status==="PEAK_IDENTIFIED") state="CERVICAL_TRANSITION";
  if (doubleCheck.status==="DOUBLE_CHECK_COMPLETE") state="DOUBLE_CHECK_COMPLETE";
  if (sorted.some(isDisturbed) && state==="OBSERVING") state="DISTURBED";
  return {version:RPS02_VERSION,state,thermal,cervical,doubleCheck};
}

export const TUTOR_MESSAGES=Object.freeze({
  fr:{
    insufficient:"Continuez vos observations quotidiennes. SymRella ne dispose pas encore de suffisamment de données pour interpréter ce cycle.",
    disturbed:"Cette mesure est signalée comme potentiellement perturbée. Elle reste enregistrée, mais SymRella évite de l'utiliser dans ce calcul.",
    thermalCandidate:"Une élévation thermique est en cours d'observation. Quelques mesures supplémentaires sont nécessaires avant de pouvoir l'évaluer.",
    cervical:"Une évolution de l'observation cervicale a été détectée. Les prochains jours permettront de poursuivre l'évaluation.",
    pending:"Les deux indicateurs ne sont pas encore concordants. SymRella poursuit l'observation plutôt que de conclure.",
    complete:"Les critères d'observation configurés pour ce référentiel sont maintenant réunis.",
    unresolved:"Les observations présentent une configuration que SymRella ne peut pas interpréter de façon suffisamment fiable. L'analyse est laissée en suspens."
  },
  en:{
    insufficient:"Continue your daily observations. SymRella does not yet have enough data to interpret this cycle.",
    disturbed:"This measurement is marked as potentially disturbed. It remains recorded, but SymRella avoids using it in this calculation.",
    thermalCandidate:"A temperature rise is being observed. More measurements are needed before it can be evaluated.",
    cervical:"A change in the cervical observation has been detected. The next days will allow the evaluation to continue.",
    pending:"The two indicators are not yet concordant. SymRella continues observing rather than concluding.",
    complete:"The observation criteria configured for this reference are now complete.",
    unresolved:"The observations show a configuration that SymRella cannot interpret reliably enough. The analysis remains pending."
  }
});

export function getTutorMessage(state,lang="fr") {
  const m=TUTOR_MESSAGES[lang]||TUTOR_MESSAGES.fr;
  if (state==="NO_DATA") return m.insufficient;
  if (state==="DISTURBED") return m.disturbed;
  if (state==="THERMAL_RISE_CANDIDATE") return m.thermalCandidate;
  if (state==="CERVICAL_TRANSITION") return m.cervical;
  if (state==="DOUBLE_CHECK_PENDING") return m.pending;
  if (state==="DOUBLE_CHECK_COMPLETE") return m.complete;
  if (state==="UNRESOLVED") return m.unresolved;
  return m.insufficient;
}
