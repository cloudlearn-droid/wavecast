import { useEffect } from "react";
import { usePlayer } from "../context/PlayerContext";

export default function PlayerBar() {
  const { currentTrack, audioRef } = usePlayer();

  // Restore time on refresh
  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;

    const saved = localStorage.getItem("wavecast-player");
    if (!saved) return;

    const { time } = JSON.parse(saved);
    if (time != null) {
      audioRef.current.currentTime = time;
    }
  }, [currentTrack, audioRef]);

  // Persist time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const save = () =>
      localStorage.setItem(
        "wavecast-player",
        JSON.stringify({ time: audio.currentTime })
      );

    audio.addEventListener("timeupdate", save);
    audio.addEventListener("pause", save);

    return () => {
      audio.removeEventListener("timeupdate", save);
      audio.removeEventListener("pause", save);
    };
  }, [currentTrack, audioRef]);

  if (!currentTrack) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        background: "#fff",
        borderTop: "1px solid #ddd",
      }}
    >
      <strong>{currentTrack.title}</strong>

      {/* ✅ Single source of truth */}
      <audio
        ref={audioRef}
        src={currentTrack.audio_url}
        controls
        style={{ width: "100%", marginTop: 8 }}
      />
    </div>
  );
}
