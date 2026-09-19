import assert from "node:assert/strict";
import test from "node:test";

import { applyVerified, parseCropHealth } from "./cropHealth.js";

const base = {
  action: "answer" as const,
  holdPlant: false,
  intent: "diagnose" as const,
  reply: "This looks like early blight. Pull the plant.",
  understood: true,
};

test("a confident tomato late blight result is the verified problem", () => {
  const check = parseCropHealth({
    result: {
      crop: { suggestions: [{ name: "tomato", probability: 0.91, scientific_name: "Solanum lycopersicum" }] },
      disease: { suggestions: [{ name: "late blight", probability: 0.74 }, { name: "early blight", probability: 0.1 }] },
    },
  });
  assert.equal(check.status, "disease");
  assert.equal(check.problem, "late blight");
  assert.equal(check.holdPlant, false);
});

test("a potato photo is not treated as a tomato disease", () => {
  const check = parseCropHealth({
    result: {
      crop: { suggestions: [{ name: "potato", probability: 0.88, scientific_name: "Solanum tuberosum" }] },
      disease: { suggestions: [{ name: "late blight", probability: 0.8 }] },
    },
  });
  assert.equal(check.status, "not_tomato");
});

test("a weak result asks for another photo instead of a disease name", () => {
  const check = parseCropHealth({
    result: {
      crop: { suggestions: [{ name: "tomato", probability: 0.5 }] },
      disease: { suggestions: [{ name: "early blight", probability: 0.11 }] },
    },
  });
  assert.equal(check.status, "unclear");
});

test("gemini cannot rename the verified problem", () => {
  const check = parseCropHealth({
    result: {
      crop: { suggestions: [{ name: "tomato", probability: 0.9 }] },
      disease: { suggestions: [{ name: "late blight", probability: 0.8 }] },
    },
  });
  const advice = applyVerified(base, check);
  assert.match(advice.reply, /late blight/i);
  assert.doesNotMatch(advice.reply, /early blight/i);
  assert.equal(advice.understood, true);
});

test("bacterial wilt keeps the hold flag", () => {
  const check = parseCropHealth({
    result: {
      crop: { suggestions: [{ name: "tomato", probability: 0.8 }] },
      disease: { suggestions: [{ name: "bacterial wilt", probability: 0.66 }] },
    },
  });
  assert.equal(check.holdPlant, true);
  const advice = applyVerified({ ...base, reply: "The plant is wilting." }, check);
  assert.equal(advice.holdPlant, true);
  assert.match(advice.reply, /bacterial wilt/i);
});
