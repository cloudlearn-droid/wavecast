import { usePlayer } from "./PlayerContext";

export default function NowPlayingBar() {
  const { currentTrack, isPlaying, play, pause } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-black/80 backdrop-blur border-t border-white/10 text-white px-4 py-3 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">
          {currentTrack.title}
        </p>
        <p className="text-xs text-white/50">
          {currentTrack.artist_name || "Unknown Artist"}
        </p>
      </div>

      {isPlaying ? (
        <button
          onClick={pause}
          className="px-4 py-2 bg-white/10 rounded-lg"
        >
          ⏸
        </button>
      ) : (
        <button
          onClick={() => play(currentTrack)}
          className="px-4 py-2 bg-white/10 rounded-lg"
        >
          ▶️
        </button>
      )}
    </div>
  );
}
