import { usePlayer } from "../context/PlayerContext";
import Visualizer from "./Visualizer";

function formatTime(sec) {
  if (!sec) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function BottomPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seek,
  } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "10px 20px",
        background: "#111",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <strong>{currentTrack.title}</strong>
      <Visualizer />

      <button onClick={togglePlay}>
        {isPlaying ? "Pause" : "Play"}
      </button>

      <span>{formatTime(currentTime)}</span>

      <input
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={(e) => seek(Number(e.target.value))}
        style={{ flex: 1 }}
      />

      <span>{formatTime(duration)}</span>
    </div>
  );
}
