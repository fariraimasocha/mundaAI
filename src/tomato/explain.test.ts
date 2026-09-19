import assert from "node:assert/strict";
import test from "node:test";

import { explainQuestion } from "./explain.js";

test("signs of late blight are answered without Gemini", () => {
  const reply = explainQuestion("what are signs of late blight", "Farirai Masocha");
  assert.ok(reply);
  assert.match(reply, /\*Farirai, signs of late blight\*/);
  assert.match(reply, /White mould/);
  assert.doesNotMatch(reply, /0781840930|pull|burn/i);
});

test("a sick-plant report is not replaced by the signs card", () => {
  assert.equal(explainQuestion("my leaves have late blight and the fruit is rotting", "Farirai"), null);
});
