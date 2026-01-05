import { useEffect, useState } from "react";
import { apiGet } from "../config/api";
import { useAuth } from "../context/AuthContext";

export default function ArtistList({ onSelect }) {
  const { token } = useAuth();
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    apiGet("/artists/", token).then(setArtists);
  }, [token]);

  return (
    <div>
      <h2>Artists</h2>

      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        {artists.map((artist) => (
          <div
            key={artist.id}
            onClick={() => onSelect(artist)}
            style={{
              width: "150px",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            {artist.image_url && (
              <img
                src={artist.image_url}
                alt={artist.name}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            )}
            <div>{artist.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
