import test from "node:test";
import assert from "node:assert/strict";

import { sanitizeFps } from "../player-core.js";

test("sanitizeFps applies fallback for invalid values", () => {
  assert.equal(sanitizeFps("48"), 48);
  assert.equal(sanitizeFps("0"), 24);
  assert.equal(sanitizeFps("foo", 30), 30);
});
