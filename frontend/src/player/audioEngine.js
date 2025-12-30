let audioCtx;
let analyser;
let source;
let audioEl;

export function initAudio() {
  if (audioCtx) return;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
}

export function playTrack(url) {
  initAudio();

  if (audioEl) {
    audioEl.pause();
  }

  audioEl = new Audio(url);
  audioEl.crossOrigin = "anonymous";

  // expose for pause control
  window.__wavecast_audio__ = audioEl;

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  source = audioCtx.createMediaElementSource(audioEl);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  audioEl.play();
}


export function getFrequencyData() {
  if (!analyser) return null;

  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  return data;
}
