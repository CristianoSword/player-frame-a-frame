import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { JSDOM } from "jsdom";

import { setupPlayerApp } from "../app.js";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");

function createEnvironment() {
  const dom = new JSDOM(html, {
    url: "http://localhost/",
    pretendToBeVisual: true
  });

  const { window } = dom;
  const { document } = window;
  const revokedUrls = [];
  let objectUrlCount = 0;

  Object.defineProperty(window.HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value() {
      return {
        drawImage() {}
      };
    }
  });

  Object.defineProperty(window.HTMLMediaElement.prototype, "load", {
    configurable: true,
    value() {}
  });

  Object.defineProperty(window.HTMLMediaElement.prototype, "play", {
    configurable: true,
    value() {
      return Promise.resolve();
    }
  });

  Object.defineProperty(window.HTMLMediaElement.prototype, "pause", {
    configurable: true,
    value() {}
  });

  window.requestAnimationFrame = callback => {
    callback(16);
    return 1;
  };

  window.cancelAnimationFrame = () => {};

  window.URL.createObjectURL = () => {
    objectUrlCount += 1;
    return `blob:video-${objectUrlCount}`;
  };

  window.URL.revokeObjectURL = url => {
    revokedUrls.push(url);
  };

  return {
    app: setupPlayerApp(document, window),
    document,
    revokedUrls
  };
}

function defineVideoMetrics(video, metrics = {}) {
  const defaults = {
    duration: 12,
    videoWidth: 1280,
    videoHeight: 720,
    currentTime: 0
  };

  for (const [key, value] of Object.entries({ ...defaults, ...metrics })) {
    Object.defineProperty(video, key, {
      configurable: true,
      writable: true,
      value
    });
  }
}

test("loading metadata reveals the player and populates video info", () => {
  const { app, document } = createEnvironment();
  app.loadVideoFile({ name: "sample.mp4" });

  defineVideoMetrics(app.elements.video, { duration: 3.5, videoWidth: 1920, videoHeight: 1080 });
  app.elements.video.dispatchEvent(new document.defaultView.Event("loadedmetadata"));

  assert.equal(app.elements.playerWrap.style.display, "block");
  assert.equal(app.elements.dropZone.style.display, "none");
  assert.equal(app.elements.infoDuration.textContent, "3.500s");
  assert.equal(app.elements.infoResolution.textContent, "1920x1080");
});

test("reloading a file resets state and revokes the previous object URL", () => {
  const { app, revokedUrls, document } = createEnvironment();
  const firstFile = { name: "first.mp4" };
  const secondFile = { name: "second.mp4" };

  app.state.isLooping = true;
  app.elements.speedInput.value = "3";
  app.elements.fpsInput.value = "48";
  app.loadVideoFile(firstFile);

  defineVideoMetrics(app.elements.video, { duration: 10, currentTime: 2 });
  app.elements.video.dispatchEvent(new document.defaultView.Event("loadedmetadata"));
  app.elements.video.currentTime = 2;

  app.loadVideoFile(secondFile);

  assert.deepEqual(revokedUrls, ["blob:video-1"]);
  assert.equal(app.elements.speedInput.value, "0");
  assert.equal(app.elements.speedLabel.textContent, "1x");
  assert.equal(app.elements.loopButton.getAttribute("aria-pressed"), "false");
  assert.equal(app.elements.seek.value, "0");
});
