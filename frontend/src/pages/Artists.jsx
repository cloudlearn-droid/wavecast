import { useEffect, useState } from "react";
import { getArtists } from "../api/artists";

export default function Artists({ onSelectArtist }) {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    getArtists().then((res) => {
      // 🔒 SAFETY: handle wrapped responses
      if (Array.isArray(res)) {
        setArtists(res);
      } else if (Array.isArray(res.artists)) {
        setArtists(res.artists);
      } else if (Array.isArray(res.data)) {
        setArtists(res.data);
      } else {
        console.error("Unexpected artists response:", res);
        setArtists([]);
      }
    });
  }, []);

  return (
    <div className="relative z-10 p-4 text-white">
      <h1 className="text-lg font-semibold mb-4">Artists</h1>

      {artists.length === 0 && (
        <p className="text-white/50 text-sm">No artists found</p>
      )}

      {artists.map((artist) => (
        <button
          key={artist.id}
          onClick={() => onSelectArtist(artist)}
          className="w-full text-left py-3 border-b border-white/10"
        >
          {artist.name}
        </button>
      ))}
    </div>
  );
}
