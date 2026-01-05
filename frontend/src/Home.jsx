import { useState } from "react";
import TrackList from "./components/TrackList";
import PlaylistList from "./components/PlaylistList";
import PlaylistDetail from "./components/PlaylistDetail";
import ArtistList from "./components/ArtistList";
import ArtistDetail from "./components/ArtistDetail";

export default function Home() {
  const [view, setView] = useState("home");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);

  if (view === "playlist" && selectedPlaylist) {
    return (
      <PlaylistDetail
        playlist={selectedPlaylist}
        onBack={() => {
          setView("home");
        }}
      />
    );
  }

  if (view === "artist" && selectedArtist) {
    return (
      <ArtistDetail
        artist={selectedArtist}
        onBack={() => {
          setSelectedArtist(null);
          setView("home");
        }}
      />
    );
  }

  return (
    <div style={{ paddingBottom: 120 }}>
      <h1>WaveCast</h1>

      <ArtistList
        onSelect={(artist) => {
          setSelectedArtist(artist);
          setView("artist");
        }}
      />

      <hr />

      <TrackList selectedPlaylist={selectedPlaylist} />

      <hr />

      <PlaylistList
        onSelect={(playlist) => {
          setSelectedPlaylist(playlist);
          setView("playlist");
        }}
      />
    </div>
  );
}
