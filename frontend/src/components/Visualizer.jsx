import { useEffect, useRef } from "react";
import { usePlayer } from "../context/PlayerContext";

export default function Visualizer() {
  const canvasRef = useRef(null);
  const { isPlaying } = usePlayer();

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    const bars = 20;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < bars; i++) {
        const height = Math.random() * canvas.height;
        ctx.fillStyle = "#6c5ce7";
        ctx.fillRect(i * 15, canvas.height - height, 10, height);
      }
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={60}
      style={{ background: "#000", marginTop: "10px" }}
    />
  );
}
