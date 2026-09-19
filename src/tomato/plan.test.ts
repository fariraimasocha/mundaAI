import assert from "node:assert/strict";
import test from "node:test";

import { looksLikePlan, planReply, plantCount } from "./plan.js";

test("a start-up question is a plan, not a sick plant", () => {
  assert.equal(looksLikePlan("i want to grow 100 plants what do i need"), true);
  assert.equal(looksLikePlan("my leaves are brown"), false);
  assert.equal(looksLikePlan("Olk thanks"), false);
});

test("plant count comes from the message", () => {
  assert.equal(plantCount("I want to grow 100 plants"), 100);
  assert.equal(plantCount("0.5 ha"), 10_000);
  assert.equal(plantCount("hello"), null);
});

test("a 100-plant plan lists seedlings and land, not a spray dose", () => {
  const reply = planReply({ count: 100, name: "Farirai Masocha", text: "what do i need" });
  assert.match(reply, /\*Farirai, for 100 tomato plants\*/);
  assert.match(reply, /110 healthy seedlings/);
  assert.match(reply, /50 square metres/);
  assert.match(reply, /5 kg Compound D/);
  assert.doesNotMatch(reply, /Mancozeb|ml|pull|burn/i);
});

test("a watering question does not repeat the shopping list", () => {
  const reply = planReply({ count: 100, name: null, text: "how often should I water" });
  assert.match(reply, /\*Water\*/);
  assert.doesNotMatch(reply, /seedlings/);
});
