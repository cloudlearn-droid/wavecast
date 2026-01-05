import TrackList from "./components/TrackList";
import PlaylistList from "./components/PlaylistList";
import ArtistList from "./components/ArtistList";

export default function Home() {
  return (
    <div style={{ paddingBottom: 120 }}>
      <h1>WaveCast</h1>

      <TrackList />
      <hr />

      <PlaylistList />
      <hr />

      <ArtistList />
    </div>
  );
}
