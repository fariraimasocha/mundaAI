import assert from "node:assert/strict";
import test from "node:test";

import { matchPlace } from "./places.js";

test("Chivhu is Mashonaland East, not an unknown town", () => {
  const place = matchPlace("Chikomba, chivhu");
  assert.ok(place);
  assert.equal(place.label, "Mashonaland East");
  assert.equal(place.capital, "Marondera");
});

test("Matabeleland South wins over a shorter name", () => {
  const place = matchPlace("I am in Matabeleland South");
  assert.ok(place);
  assert.equal(place.capital, "Gwanda");
});

test("an unknown place does not match", () => {
  assert.equal(matchPlace("Atlantis"), null);
});
