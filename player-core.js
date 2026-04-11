export const SPEED_MAP = {
  "-3": { multiplier: -8, label: "-8x" },
  "-2": { multiplier: -4, label: "-4x" },
  "-1": { multiplier: -2, label: "-2x" },
  "0": { multiplier: 1, label: "1x" },
  "1": { multiplier: 2, label: "2x" },
  "2": { multiplier: 4, label: "4x" },
  "3": { multiplier: 8, label: "8x" }
};

export function sanitizeFps(value, fallback = 24) {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export function frameStepFromFps(value, fallback = 24) {
  return 1 / sanitizeFps(value, fallback);
}

export function getFrameNumber(currentTime, fpsValue) {
  return Math.round(currentTime / frameStepFromFps(fpsValue));
}

export function clampTime(time, duration) {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const safeTime = Number.isFinite(time) ? time : 0;
  return Math.min(Math.max(safeTime, 0), safeDuration);
}

export function getSeekValue(currentTime, duration) {
  if (!Number.isFinite(duration) || duration <= 0) {
    return 0;
  }

  return Math.round((clampTime(currentTime, duration) / duration) * 1000);
}

export function formatTime(seconds) {
  const safeTime = Number.isFinite(seconds) ? seconds : 0;
  return `${safeTime.toFixed(3)}s`;
}

export function formatResolution(width, height) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return "-";
  }

  return `${width}x${height}`;
}

export function getSpeedConfig(value) {
  return SPEED_MAP[String(value)] ?? SPEED_MAP["0"];
}

export function isEditableTarget(target) {
  if (!target || typeof target !== "object") {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  const tagName = typeof target.tagName === "string" ? target.tagName.toUpperCase() : "";
  return tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";
}
