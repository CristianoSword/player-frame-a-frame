import test from "node:test";
import assert from "node:assert/strict";

import {
  clampTime,
  frameStepFromFps,
  getFrameNumber,
  getSeekValue,
  sanitizeFps
} from "../player-core.js";

test("sanitizeFps applies fallback for invalid values", () => {
  assert.equal(sanitizeFps("48"), 48);
  assert.equal(sanitizeFps("0"), 24);
  assert.equal(sanitizeFps("foo", 30), 30);
});

test("frame helpers compute frame and seek data consistently", () => {
  assert.equal(frameStepFromFps(25), 0.04);
  assert.equal(getFrameNumber(1, 25), 25);
  assert.equal(getSeekValue(5, 10), 500);
  assert.equal(clampTime(15, 10), 10);
  assert.equal(clampTime(-2, 10), 0);
});
