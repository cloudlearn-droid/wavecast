import { useState } from "react";
import TrackList from "./components/TrackList";
import PlaylistList from "./components/PlaylistList";
import ArtistList from "./components/ArtistList";
import ArtistDetail from "./components/ArtistDetail";

export default function Home() {
  const [view, setView] = useState("artists");
  const [selectedArtist, setSelectedArtist] = useState(null);

  if (view === "artist" && selectedArtist) {
    return (
      <ArtistDetail
        artist={selectedArtist}
        onBack={() => {
          setSelectedArtist(null);
          setView("artists");
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

      <TrackList />

      <hr />

      <PlaylistList />
    </div>
  );
}
