import { useEffect, useState } from "react";
import { apiGet } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";

export default function ArtistDetail({ artist, onBack }) {
  const { token } = useAuth();
  const { playTrack } = usePlayer();

  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    apiGet(`/artists/${artist.id}/tracks`, token).then(setTracks);
    apiGet(`/artists/${artist.id}/albums`, token).then(setAlbums);
  }, [artist, token]);

  return (
    <div>
      <button onClick={onBack}>← Back</button>

      <h2>{artist.name}</h2>

      {artist.bio && <p>{artist.bio}</p>}

      <h3>Tracks</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tracks.map((track) => (
          <li
            key={track.id}
            onClick={() => playTrack(track)}
            style={{
              padding: "8px",
              borderBottom: "1px solid #ddd",
              cursor: "pointer",
            }}
          >
            ▶ {track.title}
          </li>
        ))}
      </ul>

      <h3>Albums</h3>
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        {albums.map((album) => (
          <div key={album.id} style={{ width: "120px" }}>
            <img
              src={album.cover_image_url}
              alt={album.title}
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
              }}
            />
            <div>{album.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
