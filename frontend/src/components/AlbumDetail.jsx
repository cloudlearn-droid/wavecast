import { useEffect, useState } from "react";
import { apiGet } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";

export default function AlbumDetail({ album, onBack }) {
  const { token } = useAuth();
  const { playTrack } = usePlayer();
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    apiGet(`/albums/${album.id}/tracks`, token).then(setTracks);
  }, [album, token]);

  const playAlbum = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0]);
    }
  };

  return (
    <div style={{ paddingBottom: "100px" }}>
      <button onClick={onBack}>← Back</button>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <img
          src={album.cover_image_url}
          alt={album.title}
          style={{
            width: "180px",
            height: "180px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />

        <div>
          <h2>{album.title}</h2>
          <button onClick={playAlbum}>▶ Play Album</button>
        </div>
      </div>

      <h3 style={{ marginTop: "30px" }}>Tracks</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tracks.map((track, index) => (
          <li
            key={track.id}
            onClick={() => playTrack(track)}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ddd",
              cursor: "pointer",
              display: "flex",
              gap: "10px",
            }}
          >
            <span style={{ width: "24px", color: "#666" }}>
              {index + 1}
            </span>
            <span>{track.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
