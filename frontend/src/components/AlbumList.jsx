import { useEffect, useState } from "react";
import { apiGet } from "../config/api";
import { useAuth } from "../context/AuthContext";

export default function AlbumList({ onSelect }) {
  const { token } = useAuth();
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    apiGet("/albums", token).then(setAlbums);
  }, [token]);

  return (
    <div>
      <h2>Albums</h2>

      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        {albums.map((album) => (
          <div
            key={album.id}
            onClick={() => onSelect(album)}
            style={{
              width: "150px",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <img
              src={album.cover_image_url}
              alt={album.title}
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
            <div>{album.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
