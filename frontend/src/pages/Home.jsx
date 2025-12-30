import { playTrack } from "../player/audioEngine";

export default function Home() {
  const testUrl = "/audio/test.wav"; // 👈 WAV instead of MP3

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-20">
      <button
        onClick={() => playTrack(testUrl)}
        className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg"
      >
        ▶ Play Test Track
      </button>
    </div>
  );
}
