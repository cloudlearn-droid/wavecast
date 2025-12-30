import React, { useEffect, useRef } from "react";
import { getFrequencyData } from "./audioEngine";

export default function WaveVisualizer() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let time = 0;
    let lastEnergy = 0;
    let beatPulse = 0;

    const waveData = Array.from({ length: 8 }).map(() => ({
      value: 0.25,
      targetValue: 0.25,
      speed: Math.random() * 0.02 + 0.015
    }));

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function updateWaveData() {
      const freqData = getFrequencyData();

      let bassEnergy = 0.2;

      if (freqData) {
        // 🔥 Kick drum (very low bass)
        const kickBins = freqData.slice(1, 8);
        let kick =
          kickBins.reduce((a, b) => a + b, 0) / kickBins.length;
        kick /= 255;

        // 🔥 Low-mid body
        const lowMidBins = freqData.slice(8, 24);
        let lowMid =
          lowMidBins.reduce((a, b) => a + b, 0) / lowMidBins.length;
        lowMid /= 255;

        // Combine energies
        bassEnergy = kick * 0.75 + lowMid * 0.25;

        // Exaggerate peaks (human-perceived loudness)
        bassEnergy = Math.pow(bassEnergy, 0.45);

        // 🎯 Beat detection (transient spike)
        const delta = bassEnergy - lastEnergy;
        if (delta > 0.08) {
          beatPulse = 1;
        }

        lastEnergy = bassEnergy;
      }

      // 🫀 Pulse decay (smooth falloff)
      beatPulse *= 0.88;

      waveData.forEach((data, i) => {
        const layerBoost = (i + 1) / waveData.length;

        data.targetValue =
          0.12 +
          bassEnergy * 1.6 * layerBoost +
          beatPulse * 0.9 * layerBoost;

        const diff = data.targetValue - data.value;
        data.value += diff * (data.speed * 1.6); // fast attack
      });
    }

    function draw() {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      waveData.forEach((data, i) => {
        const freq = data.value * 7;
        ctx.beginPath();

        for (let x = 0; x < canvas.width; x++) {
          const nx = (x / canvas.width) * 2 - 1;
          const px = nx + i * 0.04 + freq * 0.03;
          const py =
            Math.sin(px * 10 + time) *
            Math.cos(px * 2) *
            freq *
            0.1 *
            ((i + 1) / waveData.length);

          const y = (py + 1) * canvas.height * 0.5;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }

        const intensity = Math.min(1, freq * 0.35);
        const r = 79 + intensity * 120;
        const g = 70 + intensity * 140;
        const b = 229;

        ctx.lineWidth = 1.2 + i * 0.35;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.65)`;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
    }

    function animate() {
      time += 0.028; // tighter rhythm
      updateWaveData();
      draw();
      requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
    />
  );
}
