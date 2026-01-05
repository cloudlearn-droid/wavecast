import { useEffect, useState } from "react";
import { apiGet, apiDelete } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";

export default function PlaylistDetail({ playlist, onBack }) {
  const { token } = useAuth();
  const { playTrack } = usePlayer();
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    apiGet(`/playlists/${playlist.id}`, token).then((data) => {
      setTracks(data.tracks || []);
    });
  }, [playlist, token]);

  const removeTrack = async (trackId) => {
    try {
      await apiDelete(
        `/playlists/${playlist.id}/tracks/${trackId}`,
        token
      );

      setTracks((prev) => prev.filter((t) => t.id !== trackId));
    } catch (err) {
      console.error(err);
      alert("Failed to remove track");
    }
  };

  return (
    <div>
      <button onClick={onBack}>← Back</button>
      <h2>{playlist.name}</h2>

      {tracks.length === 0 && <p>No tracks in this playlist.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tracks.map((track) => (
          <li
            key={track.id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ddd",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              onClick={() => playTrack(track)}
              style={{ cursor: "pointer" }}
            >
              ▶ {track.title}
            </span>

            <button onClick={() => removeTrack(track.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
