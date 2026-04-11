import test from "node:test";
import assert from "node:assert/strict";

import {
  clampTime,
  formatResolution,
  formatTime,
  frameStepFromFps,
  getFrameNumber,
  getSeekValue,
  getSpeedConfig,
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

test("formatters expose stable UI strings", () => {
  assert.equal(formatTime(1.23456), "1.235s");
  assert.equal(formatResolution(1920, 1080), "1920x1080");
  assert.equal(formatResolution(0, 1080), "-");
});

test("speed config reflects reverse playback labels", () => {
  assert.deepEqual(getSpeedConfig("-2"), { multiplier: -4, label: "-4x" });
  assert.deepEqual(getSpeedConfig("9"), { multiplier: 1, label: "1x" });
});
