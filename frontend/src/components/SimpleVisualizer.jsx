import { useEffect, useRef } from "react";
import { usePlayer } from "../context/PlayerContext";

export default function SimpleVisualizer() {
  const { audioRef, isPlaying } = usePlayer();
  const barsRef = useRef([]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => {
      barsRef.current.forEach((bar) => {
        if (!bar) return;

        const height = isPlaying
          ? 20 + Math.random() * 60
          : 10;

        bar.style.height = `${height}px`;
      });
    };

    audio.addEventListener("timeupdate", update);
    return () => audio.removeEventListener("timeupdate", update);
  }, [isPlaying, audioRef]);

  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        justifyContent: "center",
        alignItems: "flex-end",
        height: 80,
        marginTop: 8,
      }}
    >
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (barsRef.current[i] = el)}
          style={{
            width: 6,
            height: 10,
            background: "#6366f1",
            borderRadius: 3,
            transition: "height 0.1s ease",
          }}
        />
      ))}
    </div>
  );
}
