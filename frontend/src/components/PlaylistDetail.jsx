import { useEffect, useState } from "react";
import { apiGet, apiDelete } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";

export default function PlaylistDetail({ playlist, onBack }) {
  const { token } = useAuth();
  const { currentTrack, setCurrentTrack } = usePlayer();

  const [tracks, setTracks] = useState([]);
  const [queueIndex, setQueueIndex] = useState(null);

  // Load playlist tracks
  useEffect(() => {
    if (!playlist) return;

    apiGet(`/playlists/${playlist.id}`, token).then((data) => {
      setTracks(data.tracks || []);
    });
  }, [playlist, token]);

  // ▶ Play current queue track
  useEffect(() => {
    if (queueIndex === null) return;
    if (!tracks[queueIndex]) return;

    setCurrentTrack(tracks[queueIndex]);

    // Explicitly play (user initiated via Play All)
    setTimeout(() => {
      const audio = document.querySelector("audio");
      if (audio) {
        audio.play().catch(() => {});
      }
    }, 0);
  }, [queueIndex, tracks, setCurrentTrack]);

  // 🔁 Re-bind ended listener EVERY time track changes
  useEffect(() => {
    const audio = document.querySelector("audio");
    if (!audio) return;

    const onEnded = () => {
      setQueueIndex((prev) =>
        prev !== null && prev + 1 < tracks.length ? prev + 1 : null
      );
    };

    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [currentTrack, tracks]);

  const playAll = () => {
    if (tracks.length === 0) return;
    setQueueIndex(0);
  };

  const playSingle = (track) => {
    setQueueIndex(null); // exit playlist mode
    setCurrentTrack(track);

    // Explicit play (user click)
    setTimeout(() => {
      const audio = document.querySelector("audio");
      if (audio) {
        audio.play().catch(() => {});
      }
    }, 0);
  };

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

      {tracks.length > 0 && (
        <button onClick={playAll} style={{ marginBottom: 12 }}>
          ▶ Play All
        </button>
      )}

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
              background:
                currentTrack?.id === track.id ? "#f0f0f0" : "transparent",
            }}
          >
            <span
              onClick={() => playSingle(track)}
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
