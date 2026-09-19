import assert from "node:assert/strict";
import test from "node:test";

import { guardReply } from "./guard.js";

test("whole-plant destruction is removed and leaf picking stays", () => {
  const reply = guardReply("Pick off the worst leaves. Pull the plant and burn them.", false);
  assert.match(reply, /Pick off the worst leaves/);
  assert.doesNotMatch(reply, /Pull the plant/);
  assert.doesNotMatch(reply, /burn them/);
});

test("a wilt reply gains the Fari line and does not lose it", () => {
  const once = guardReply("This looks like bacterial wilt. Do not compost it.", true);
  assert.match(once, /0781840930/);
  const twice = guardReply(once, true);
  assert.equal(twice.split("0781840930").length - 1, 1);
});

test("a one-block reply is split into lines a phone can read", () => {
  const reply = guardReply(
    "Farirai, this looks like late blight. Pick off the worst fruit. Spray Mancozeb 800 WP.",
    false,
  );
  assert.equal(
    reply,
    "Farirai, this looks like late blight.\nPick off the worst fruit.\nSpray Mancozeb 800 WP.",
  );
});
