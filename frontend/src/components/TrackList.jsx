import { useEffect, useState } from "react";
import { apiGet } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";
import { useLikes } from "../context/LikesContext";

export default function TrackList() {
  const { token } = useAuth();
  const { setCurrentTrack } = usePlayer();
  const { likedIds, like, unlike, loading } = useLikes();
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    apiGet("/tracks/", token).then(setTracks);
  }, [token]);

  if (loading) return <p>Loading likes…</p>;

  return (
    <>
      <h2>Tracks</h2>

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
              onClick={() => (isLiked ? unlike(id) : like(id))}
            >
              {isLiked ? "❤️" : "🤍"}
            </button>
          </div>
        );
      })}
    </>
  );
}
