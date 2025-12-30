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

  // Stop previous track
  if (audioEl) {
    audioEl.pause();
    audioEl.src = "";
  }

  audioEl = new Audio(url);
  audioEl.crossOrigin = "anonymous";
  audioEl.loop = false;

  // Resume AudioContext (required by browser)
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  // Connect audio element to analyser
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
