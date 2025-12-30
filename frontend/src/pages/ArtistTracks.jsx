import { useEffect, useState } from "react";
import { getTracksByArtist } from "../api/artists";
import { playTrack } from "../player/audioEngine";

export default function ArtistTracks({ artist, onBack }) {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    getTracksByArtist(artist.id).then((res) => {
      // 🔒 Defensive handling of API response
      if (Array.isArray(res)) {
        setTracks(res);
      } else if (Array.isArray(res.tracks)) {
        setTracks(res.tracks);
      } else if (Array.isArray(res.data)) {
        setTracks(res.data);
      } else {
        console.warn("Unexpected tracks response:", res);
        setTracks([]);
      }
    });
  }, [artist.id]);

  return (
    <div className="relative z-10 p-4 text-white">
      <button
        onClick={onBack}
        className="text-sm text-white/70 mb-4"
      >
        ← Back
      </button>

      <h2 className="text-lg font-semibold mb-4">
        {artist.name}
      </h2>

      {tracks.length === 0 && (
        <p className="text-white/50 text-sm">
          No tracks uploaded for this artist yet.
        </p>
      )}

      {tracks.map((track) => (
        <div
          key={track.id}
          className="flex items-center justify-between py-3 border-b border-white/10"
        >
          <div>
            <p className="text-sm font-medium">{track.title}</p>
            <p className="text-xs text-white/50">
              {Math.floor(track.duration_seconds / 60)}:
              {String(track.duration_seconds % 60).padStart(2, "0")}
            </p>
          </div>

          <button
            onClick={() => playTrack(track.audio_url)}
            className="px-3 py-1.5 text-xs bg-indigo-600 rounded-lg"
          >
            ▶ Play
          </button>
        </div>
      ))}
    </div>
  );
}
