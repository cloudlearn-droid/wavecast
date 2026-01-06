import { useEffect, useState } from "react";
import { apiGet, apiDelete } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";

export default function PlaylistDetail({ playlist, onBack }) {
  const { token } = useAuth();
  const { playPlaylist, playTrack, currentTrack } = usePlayer();
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (!playlist) return;
    apiGet(`/playlists/${playlist.id}`, token).then(
      (data) => setTracks(data.tracks || [])
    );
  }, [playlist, token]);

  const removeTrack = async (trackId) => {
    await apiDelete(
      `/playlists/${playlist.id}/tracks/${trackId}`,
      token
    );
    setTracks((prev) => prev.filter((t) => t.id !== trackId));
  };

  return (
    <div>
      <button onClick={onBack}>← Back</button>
      <h2>{playlist.name}</h2>

      {tracks.length > 0 && (
        <button onClick={() => playPlaylist(tracks)}>
          ▶ Play All
        </button>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tracks.map((track) => (
          <li
            key={track.id}
            style={{
              padding: 10,
              display: "flex",
              justifyContent: "space-between",
              background:
                currentTrack?.id === track.id ? "#f0f0f0" : "transparent",
            }}
          >
            <span
              style={{ cursor: "pointer" }}
              onClick={() => playTrack(track)}
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
