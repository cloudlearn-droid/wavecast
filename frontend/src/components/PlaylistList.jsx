import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../config/api";
import { useAuth } from "../context/AuthContext";

export default function PlaylistList({ onSelect }) {
  const { token } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    apiGet("/playlists/", token).then(setPlaylists);
  }, [token]);

  const createPlaylist = async () => {
    if (!newName.trim()) {
      alert("Playlist name cannot be empty");
      return;
    }

    try {
      setCreating(true);

      const res = await apiPost(
        "/playlists/",
        { name: newName.trim() },
        token
      );

      // Add new playlist to list immediately
      setPlaylists((prev) => [...prev, res]);
      setNewName("");
    } catch (err) {
      console.error(err);
      alert("Failed to create playlist");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <h2>Playlists</h2>

      {/* Create playlist */}
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="New playlist name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button onClick={createPlaylist} disabled={creating}>
          {creating ? "Creating..." : "Create"}
        </button>
      </div>

      {/* Playlist list */}
      {playlists.map((pl) => (
        <div
          key={pl.id}
          onClick={() => onSelect(pl)}
          style={{
            cursor: "pointer",
            padding: 8,
            marginBottom: 4,
            border: "1px solid #ddd",
          }}
        >
          {pl.name}
        </div>
      ))}
    </>
  );
}
