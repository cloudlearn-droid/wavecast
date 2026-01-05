import { useEffect, useState } from "react";
import { apiGet } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";
import { useLikes } from "../context/LikesContext";

export default function ArtistDetails({ artist, onBack }) {
  const { token } = useAuth();
  const { setCurrentTrack } = usePlayer();
  const { likedIds, like, unlike } = useLikes();

  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (!artist) return;

    apiGet(`/artists/${artist.id}/tracks`, token).then(setTracks);
  }, [artist, token]);

  if (!artist) return null;

  return (
    <div>
      <button onClick={onBack}>← Back to Artists</button>

      <h2>{artist.name}</h2>

      {artist.image_url && (
        <img
          src={artist.image_url}
          alt={artist.name}
          style={{
            width: "200px",
            height: "200px",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      )}

      {artist.bio && <p>{artist.bio}</p>}

      <h3>Tracks</h3>

      {tracks.map((track) => {
        const id = String(track.id);
        const isLiked = likedIds.has(id);

        return (
          <div
            key={id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setCurrentTrack(track)}
            >
              ▶ {track.title}
            </span>

            <button
              onClick={() =>
                isLiked ? unlike(id) : like(id)
              }
            >
              {isLiked ? "❤️" : "🤍"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
