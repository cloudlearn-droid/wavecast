import { useEffect, useState } from "react";
import { getTracksByArtist } from "../api/artists";
import { usePlayer } from "../player/PlayerContext";

export default function ArtistTracks({ artist, onBack }) {
  const [tracks, setTracks] = useState([]);
  const { play } = usePlayer(); // ✅ hook INSIDE component

  useEffect(() => {
    getTracksByArtist(artist.id).then((data) => {
      setTracks(data.tracks || []);
    });
  }, [artist.id]);

  return (
    <div className="p-4 text-white">
      <button
        onClick={onBack}
        className="mb-4 px-3 py-1 bg-white/10 rounded"
      >
        ← Back
      </button>

      <h2 className="text-xl font-semibold mb-4">{artist.name}</h2>

      {tracks.map((track) => (
        <div
          key={track.id}
          className="flex items-center justify-between mb-3 p-3 bg-white/5 rounded"
        >
          <div>
            <p className="font-medium">{track.title}</p>
            <p className="text-xs text-white/50">
              {Math.floor(track.duration_seconds / 60)}:
              {(track.duration_seconds % 60)
                .toString()
                .padStart(2, "0")}
            </p>
          </div>

          <button
            onClick={() => play(track)}   // ✅ NOW VALID
            className="px-4 py-2 bg-white/10 rounded-lg"
          >
            ▶ Play
          </button>
        </div>
      ))}
    </div>
  );
}
