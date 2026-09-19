import assert from "node:assert/strict";
import test from "node:test";

import { placeQueries } from "./weather.js";

test("a district and town are searched town first", () => {
  assert.deepEqual(placeQueries("Chikomba, chivhu"), ["chivhu", "Chikomba"]);
});
