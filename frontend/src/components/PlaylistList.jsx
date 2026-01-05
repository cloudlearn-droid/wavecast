import { useEffect, useState } from "react";
import { apiGet } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";

export default function PlaylistList() {
  const { token } = useAuth();
  const { activePlaylist, setActivePlaylist } = usePlayer();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    apiGet("/playlists/", token).then(setPlaylists);
  }, [token]);

  return (
    <>
      <h2>Playlists</h2>

      {playlists.map((pl) => (
        <div
          key={pl.id}
          onClick={() => setActivePlaylist(pl)}
          style={{
            cursor: "pointer",
            padding: 8,
            marginBottom: 4,
            background:
              activePlaylist?.id === pl.id ? "#ddd" : "transparent",
          }}
        >
          {pl.name}
        </div>
      ))}
    </>
  );
}
