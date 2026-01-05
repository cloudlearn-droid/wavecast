import { useEffect, useRef } from "react";
import { usePlayer } from "../context/PlayerContext";

export default function PlayerBar() {
  const { currentTrack } = usePlayer();
  const audioRef = useRef(null);

  // 🔁 Restore time AFTER audio loads
  useEffect(() => {
    if (!currentTrack) return;

    const saved = localStorage.getItem("wavecast-player");
    if (!saved) return;

    const { time } = JSON.parse(saved);
    const audio = audioRef.current;

    if (!audio || time == null) return;

    const onLoaded = () => {
      audio.currentTime = time;
    };

    audio.addEventListener("loadedmetadata", onLoaded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [currentTrack]);

  // 💾 Persist time while playing
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const save = () => {
      const saved = localStorage.getItem("wavecast-player");
      const prev = saved ? JSON.parse(saved) : {};

      localStorage.setItem(
        "wavecast-player",
        JSON.stringify({
          ...prev,
          time: audio.currentTime,
        })
      );
    };

    audio.addEventListener("timeupdate", save);
    audio.addEventListener("pause", save);

    return () => {
      audio.removeEventListener("timeupdate", save);
      audio.removeEventListener("pause", save);
    };
  }, [currentTrack]);

  if (!currentTrack) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        borderTop: "1px solid #ddd",
        background: "#fff",
      }}
    >
      <strong>{currentTrack.title}</strong>

      <audio
        ref={audioRef}
        src={currentTrack.audio_url}
        controls
        style={{ width: "100%", marginTop: 8 }}
      />
    </div>
  );
}
