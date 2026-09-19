import assert from "node:assert/strict";
import test from "node:test";

import {
  answersCheckback,
  CHECKBACK_MS,
  checkbackDueAt,
  diagnosisProblem,
  officerCase,
  photoOutcome,
  readOutcome,
  settleCheckback,
  templateParam,
} from "./checkback.js";

const base = {
  advice: "Pick off the worst leaves.",
  fromPhoto: false,
  name: "Tendai Moyo",
  phone: "263771234567",
  photoUrl: null,
  plot: "200 plants",
  problem: "early blight",
  said: true,
  seen: null,
  town: "Marondera",
};

test("a check-back is due five days later", () => {
  const from = new Date("2026-09-19T12:00:00.000Z");
  assert.equal(checkbackDueAt(from), "2026-09-24T12:00:00.000Z");
  assert.equal(CHECKBACK_MS, 5 * 24 * 60 * 60 * 1000);
});

test("only a short better, worse, or same answer counts", () => {
  assert.equal(readOutcome("worse"), "worse");
  assert.equal(readOutcome("It's worse"), "worse");
  assert.equal(readOutcome("It is still the same"), "same");
  assert.equal(readOutcome("getting better"), "better");
  assert.equal(readOutcome("the leaves are the same colour"), null);
  assert.equal(readOutcome("how do I water"), null);
  assert.equal(answersCheckback("worse", false), true);
  assert.equal(answersCheckback("how do I water", false), false);
  assert.equal(answersCheckback(undefined, true), true);
});

test("a named disease schedules, a healthy leaf and an explanation do not", () => {
  assert.equal(
    diagnosisProblem({
      cropProblem: "late blight",
      cropStatus: "disease",
      intent: "diagnose",
      reply: "This looks like late blight.",
    }),
    "late blight",
  );
  assert.equal(
    diagnosisProblem({
      cropProblem: null,
      cropStatus: null,
      intent: "diagnose",
      reply: "*Tendai, this looks like early blight.*\nPick off the worst leaves.",
    }),
    "early blight",
  );
  assert.equal(
    diagnosisProblem({
      cropProblem: "healthy",
      cropStatus: "healthy",
      intent: "diagnose",
      reply: "This looks healthy.",
    }),
    null,
  );
  assert.equal(
    diagnosisProblem({
      cropProblem: null,
      cropStatus: null,
      intent: "advice",
      reply: "This looks like you should stake them.",
    }),
    null,
  );
});

test("a photo of the same disease is not treated as worse until the farmer says so", () => {
  assert.equal(photoOutcome("early blight", { problem: "early blight", status: "disease" }), "same");
  assert.equal(photoOutcome("early blight", { problem: "late blight", status: "disease" }), "worse");
  assert.equal(photoOutcome("early blight", { problem: null, status: "healthy" }), "better");
  assert.equal(photoOutcome("early blight", { problem: null, status: "unclear" }), "unclear");
});

test("worse sends Fari the field, and a photo that still shows the disease stays open", () => {
  const worse = settleCheckback({ ...base, outcome: "worse" });
  assert.equal(worse.close, true);
  assert.match(worse.farmerReply, /reply in this chat/);
  assert.match(worse.officerText ?? "", /Town: Marondera/);
  assert.match(worse.officerText ?? "", /200 plants/);
  assert.match(worse.officerText ?? "", /early blight/);

  const still = settleCheckback({ ...base, fromPhoto: true, outcome: "same", said: false });
  assert.equal(still.close, false);
  assert.equal(still.officerText, null);
  assert.match(still.farmerReply, /better, worse, or the same/);
});

test("template text has no line breaks", () => {
  assert.equal(templateParam("Tendai\nMoyo", "there"), "Tendai Moyo");
  assert.equal(templateParam("   ", "there"), "there");
});

test("the officer case names a new problem when the photo changed", () => {
  const text = officerCase({ ...base, seen: "late blight" });
  assert.match(text, /Now looks like: late blight/);
});
