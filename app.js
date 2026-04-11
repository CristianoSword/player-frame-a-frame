import {
  clampTime,
  formatResolution,
  formatTime,
  frameStepFromFps,
  getFrameNumber,
  getSeekValue,
  getSpeedConfig,
  isEditableTarget,
  sanitizeFps
} from "./player-core.js";

const TRANSLATIONS = {
  en: {
    htmlLang: "en",
    title: "\u25b6 player frame a frame",
    languageLabel: "Language",
    dropTitle: "Drop a video here or click to open",
    dropSub: "MP4, WebM, MOV, AVI...",
    prev: "prev",
    play: "play",
    pause: "pause",
    next: "next",
    loop: "loop",
    speed: "speed",
    frame: "frame",
    time: "time",
    duration: "duration",
    resolution: "resolution",
    shortcutFrames: "\u2190 \u2192 frame by frame",
    shortcutPlay: "space play/pause",
    footerCredit: "Made with \u2665 by Cristiano Camacho",
    seekLabel: "Video timeline",
    speedAria: "Playback speed",
    fileInputAria: "Choose a video file"
  },
  "pt-BR": {
    htmlLang: "pt-BR",
    title: "\u25b6 player frame a frame",
    languageLabel: "Idioma",
    dropTitle: "Solte um video aqui ou clique para abrir",
    dropSub: "MP4, WebM, MOV, AVI...",
    prev: "prev",
    play: "play",
    pause: "pause",
    next: "next",
    loop: "loop",
    speed: "velocidade",
    frame: "frame",
    time: "tempo",
    duration: "duracao",
    resolution: "resolucao",
    shortcutFrames: "\u2190 \u2192 frame a frame",
    shortcutPlay: "espaco play/pause",
    footerCredit: "Feito com \u2665 por Cristiano Camacho",
    seekLabel: "Linha do tempo do video",
    speedAria: "Velocidade de reproducao",
    fileInputAria: "Escolher arquivo de video"
  }
};

const DEFAULT_LANGUAGE = "en";

export function setupPlayerApp(doc = document, win = window) {
  const elements = {
    video: doc.getElementById("vid"),
    canvas: doc.getElementById("cv"),
    seek: doc.getElementById("seek"),
    playButton: doc.getElementById("btn-play"),
    loopButton: doc.getElementById("btn-loop"),
    fpsInput: doc.getElementById("fps-input"),
    speedInput: doc.getElementById("speed"),
    speedLabel: doc.getElementById("speed-label"),
    overlay: doc.getElementById("overlay-info"),
    dropZone: doc.getElementById("drop-zone"),
    fileInput: doc.getElementById("file-in"),
    playerWrap: doc.getElementById("player-wrap"),
    canvasWrap: doc.getElementById("canvas-wrap"),
    infoFrame: doc.getElementById("i-frame"),
    infoTime: doc.getElementById("i-time"),
    infoDuration: doc.getElementById("i-dur"),
    infoResolution: doc.getElementById("i-res"),
    prevButton: doc.getElementById("btn-prev"),
    nextButton: doc.getElementById("btn-next"),
    languageSelect: doc.getElementById("language-select")
  };

  const ctx = elements.canvas.getContext("2d");
  const state = {
    isPlaying: false,
    isLooping: false,
    rafId: null,
    frameRequestId: null,
    speedMultiplier: 1,
    lastTimestamp: null,
    activeObjectUrl: null,
    language: DEFAULT_LANGUAGE
  };

  function getText() {
    return TRANSLATIONS[state.language] ?? TRANSLATIONS[DEFAULT_LANGUAGE];
  }

  function applyLanguage(language) {
    state.language = TRANSLATIONS[language] ? language : DEFAULT_LANGUAGE;
    const text = getText();

    doc.documentElement.lang = text.htmlLang;
    doc.title = "Player Frame a Frame";
    elements.seek.setAttribute("aria-label", text.seekLabel);
    elements.speedInput.setAttribute("aria-label", text.speedAria);
    elements.fileInput.setAttribute("aria-label", text.fileInputAria);

    const translatable = doc.querySelectorAll("[data-i18n]");
    for (const node of translatable) {
      const key = node.getAttribute("data-i18n");
      if (!key || !(key in text)) {
        continue;
      }

      node.innerHTML = text[key];
    }

    if (elements.languageSelect) {
      elements.languageSelect.value = state.language;
    }

    updatePlayButton();
    updateInfo();
  }

  function updateLoopButton() {
    elements.loopButton.classList.toggle("accent", state.isLooping);
    elements.loopButton.setAttribute("aria-pressed", String(state.isLooping));
  }

  function updatePlayButton() {
    const text = getText();
    const verb = state.isPlaying ? text.pause : text.play;
    const icon = state.isPlaying ? "\u23f8" : "\u25b6";

    elements.playButton.innerHTML = `${icon} <span data-i18n="${state.isPlaying ? "pause" : "play"}">${verb}</span>`;
    elements.playButton.classList.toggle("accent", state.isPlaying);
    elements.playButton.setAttribute("aria-pressed", String(state.isPlaying));
  }

  function updateSpeedLabel() {
    const config = getSpeedConfig(elements.speedInput.value);
    state.speedMultiplier = config.multiplier;
    elements.speedLabel.textContent = config.label;
  }

  function getFrameStep() {
    return frameStepFromFps(elements.fpsInput.value);
  }

  function stopPlayback() {
    state.isPlaying = false;
    state.lastTimestamp = null;
    if (state.rafId !== null) {
      win.cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
    if (state.frameRequestId !== null && typeof elements.video.cancelVideoFrameCallback === "function") {
      elements.video.cancelVideoFrameCallback(state.frameRequestId);
      state.frameRequestId = null;
    }
    if (typeof elements.video.pause === "function") {
      elements.video.pause();
    }
    updatePlayButton();
  }

  function updateInfo() {
    const text = getText();
    const currentFrame = getFrameNumber(elements.video.currentTime, elements.fpsInput.value);
    elements.infoFrame.textContent = String(currentFrame);
    elements.infoTime.textContent = formatTime(elements.video.currentTime);
    elements.seek.value = String(getSeekValue(elements.video.currentTime, elements.video.duration));
    elements.overlay.textContent = `${text.frame} ${currentFrame}  ${formatTime(elements.video.currentTime)}`;
  }

  function drawFrame() {
    if (elements.canvas.width > 0 && elements.canvas.height > 0) {
      ctx.drawImage(elements.video, 0, 0, elements.canvas.width, elements.canvas.height);
    }
    updateInfo();
  }

  function scheduleFrameDraw() {
    if (!state.isPlaying || state.speedMultiplier <= 0) {
      return;
    }

    if (typeof elements.video.requestVideoFrameCallback === "function") {
      state.frameRequestId = elements.video.requestVideoFrameCallback(() => {
        state.frameRequestId = null;
        drawFrame();
        scheduleFrameDraw();
      });
      return;
    }

    state.rafId = win.requestAnimationFrame(() => {
      state.rafId = null;
      drawFrame();
      scheduleFrameDraw();
    });
  }

  function stepFrame(direction) {
    const nextTime = clampTime(
      elements.video.currentTime + direction * getFrameStep(),
      elements.video.duration
    );
    elements.video.currentTime = nextTime;
  }

  function tick(timestamp) {
    if (!state.isPlaying) {
      return;
    }

    state.rafId = win.requestAnimationFrame(tick);

    if (state.lastTimestamp === null) {
      state.lastTimestamp = timestamp;
      return;
    }

    const elapsedSeconds = (timestamp - state.lastTimestamp) / 1000;
    state.lastTimestamp = timestamp;

    const duration = Number.isFinite(elements.video.duration) ? elements.video.duration : 0;
    let nextTime = elements.video.currentTime + elapsedSeconds * state.speedMultiplier;

    if (nextTime >= duration) {
      nextTime = state.isLooping ? 0 : duration;
      if (!state.isLooping) {
        stopPlayback();
      }
    }

    if (nextTime < 0) {
      nextTime = state.isLooping ? duration : 0;
      if (!state.isLooping) {
        stopPlayback();
      }
    }

    elements.video.currentTime = nextTime;
  }

  function startPlayback() {
    if (!elements.video.src) {
      return;
    }

    state.isPlaying = true;
    state.lastTimestamp = null;
    updatePlayButton();

    if (state.speedMultiplier > 0) {
      elements.video.loop = state.isLooping;
      elements.video.playbackRate = state.speedMultiplier;
      const maybePromise = typeof elements.video.play === "function" ? elements.video.play() : null;
      scheduleFrameDraw();

      if (maybePromise && typeof maybePromise.catch === "function") {
        maybePromise.catch(() => {
          stopPlayback();
        });
      }
      return;
    }

    if (typeof elements.video.pause === "function") {
      elements.video.pause();
    }
    state.rafId = win.requestAnimationFrame(tick);
  }

  function resetPlayerState() {
    stopPlayback();
    state.isLooping = false;
    updateLoopButton();

    elements.seek.value = "0";
    elements.speedInput.value = "0";
    elements.fpsInput.value = String(sanitizeFps(elements.fpsInput.value));
    updateSpeedLabel();

    elements.infoFrame.textContent = "0";
    elements.infoTime.textContent = "0.000s";
    elements.infoDuration.textContent = "-";
    elements.infoResolution.textContent = "-";
    elements.overlay.textContent = `${getText().frame} -`;
  }

  function revokeObjectUrl() {
    if (state.activeObjectUrl) {
      win.URL.revokeObjectURL(state.activeObjectUrl);
      state.activeObjectUrl = null;
    }
  }

  function handleLoadedMetadata() {
    elements.canvas.width = elements.video.videoWidth;
    elements.canvas.height = elements.video.videoHeight;
    elements.infoDuration.textContent = formatTime(elements.video.duration);
    elements.infoResolution.textContent = formatResolution(
      elements.video.videoWidth,
      elements.video.videoHeight
    );
    elements.playerWrap.style.display = "block";
    elements.canvasWrap.style.display = "block";
    elements.dropZone.style.display = "none";
    drawFrame();
  }

  function loadVideoFile(file) {
    if (!file) {
      return;
    }

    resetPlayerState();
    revokeObjectUrl();

    state.activeObjectUrl = win.URL.createObjectURL(file);
    elements.video.src = state.activeObjectUrl;
    elements.video.load();
  }

  function onGlobalKeydown(event) {
    const activeTarget = doc.activeElement;
    if (!elements.video.src || isEditableTarget(event.target) || isEditableTarget(activeTarget)) {
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      stopPlayback();
      stepFrame(1);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stopPlayback();
      stepFrame(-1);
      return;
    }

    if (event.key === " ") {
      event.preventDefault();
      if (state.isPlaying) {
        stopPlayback();
      } else {
        startPlayback();
      }
    }
  }

  elements.dropZone.addEventListener("click", () => elements.fileInput.click());
  elements.dropZone.addEventListener("dragover", event => {
    event.preventDefault();
    elements.dropZone.classList.add("is-dragover");
  });
  elements.dropZone.addEventListener("dragleave", () => {
    elements.dropZone.classList.remove("is-dragover");
  });
  elements.dropZone.addEventListener("drop", event => {
    event.preventDefault();
    elements.dropZone.classList.remove("is-dragover");
    loadVideoFile(event.dataTransfer?.files?.[0] ?? null);
  });
  elements.fileInput.addEventListener("change", () => loadVideoFile(elements.fileInput.files?.[0] ?? null));

  elements.prevButton.addEventListener("click", () => {
    stopPlayback();
    stepFrame(-1);
  });
  elements.nextButton.addEventListener("click", () => {
    stopPlayback();
    stepFrame(1);
  });
  elements.playButton.addEventListener("click", () => {
    if (state.isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  });
  elements.loopButton.addEventListener("click", () => {
    state.isLooping = !state.isLooping;
    elements.video.loop = state.isLooping && state.speedMultiplier > 0;
    updateLoopButton();
  });
  elements.seek.addEventListener("input", () => {
    stopPlayback();
    elements.video.currentTime = (Number(elements.seek.value) / 1000) * (elements.video.duration || 0);
  });
  elements.speedInput.addEventListener("input", updateSpeedLabel);
  elements.fpsInput.addEventListener("change", () => {
    elements.fpsInput.value = String(sanitizeFps(elements.fpsInput.value));
    updateInfo();
  });
  elements.languageSelect?.addEventListener("change", event => {
    applyLanguage(event.target.value);
  });
  elements.video.addEventListener("loadedmetadata", handleLoadedMetadata);
  elements.video.addEventListener("seeked", drawFrame);
  elements.video.addEventListener("timeupdate", () => {
    if (state.isPlaying && state.speedMultiplier > 0) {
      updateInfo();
    }
  });
  elements.video.addEventListener("ended", () => {
    if (!state.isLooping) {
      stopPlayback();
      drawFrame();
    }
  });
  win.addEventListener("keydown", onGlobalKeydown);
  win.addEventListener("beforeunload", revokeObjectUrl);

  resetPlayerState();
  applyLanguage(DEFAULT_LANGUAGE);

  return {
    destroy() {
      stopPlayback();
      revokeObjectUrl();
      win.removeEventListener("keydown", onGlobalKeydown);
      win.removeEventListener("beforeunload", revokeObjectUrl);
    },
    loadVideoFile,
    state,
    elements
  };
}

if (typeof document !== "undefined" && document.getElementById("app")) {
  setupPlayerApp();
}
