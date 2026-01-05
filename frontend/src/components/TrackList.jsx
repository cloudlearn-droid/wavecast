import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";
import { useLikes } from "../context/LikesContext";

export default function TrackList({ selectedPlaylist }) {
  const { token } = useAuth();
  const { setCurrentTrack } = usePlayer();
  const { likedIds, like, unlike, loading } = useLikes();
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    apiGet("/tracks/", token).then(setTracks);
  }, [token]);

  if (loading) return <p>Loading likes…</p>;

  const addToPlaylist = async (trackId) => {
    if (!selectedPlaylist) {
      alert("Select a playlist first");
      return;
    }

    try {
      await apiPost(
        `/playlists/${selectedPlaylist.id}/tracks`,
        { track_id: trackId },
        token
      );
      alert("Added to playlist");
    } catch (err) {
      console.error(err);
      alert("Failed to add to playlist");
    }
  };

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

            <div>
              <button onClick={() => (isLiked ? unlike(id) : like(id))}>
                {isLiked ? "❤️" : "🤍"}
              </button>

              <button
                style={{ marginLeft: 8 }}
                onClick={() => addToPlaylist(id)}
              >
                ➕
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}
