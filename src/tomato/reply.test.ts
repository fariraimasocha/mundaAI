import assert from "node:assert/strict";
import test from "node:test";

import { isThanks } from "./reply.js";

test("a typo thank-you is not a new problem", () => {
  assert.equal(isThanks("Olk thanks"), true);
  assert.equal(isThanks("ok thanks"), true);
  assert.equal(isThanks("Ndatenda"), true);
});

test("a real symptom is not a thank-you", () => {
  assert.equal(isThanks("ok my leaves are brown"), false);
});
