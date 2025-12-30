import { useState } from "react";
import WaveVisualizer from "./player/WaveVisualizer";
import { PlayerProvider } from "./player/PlayerContext";
import Artists from "./pages/Artists";
import ArtistTracks from "./pages/ArtistTracks";
import NowPlayingBar from "./player/NowPlayingBar";

function App() {
  const [selectedArtist, setSelectedArtist] = useState(null);

  return (
    <PlayerProvider>
      <WaveVisualizer />

      {selectedArtist === null ? (
        <Artists onSelectArtist={setSelectedArtist} />
      ) : (
        <ArtistTracks
          artist={selectedArtist}
          onBack={() => setSelectedArtist(null)}
        />
      )}

      <NowPlayingBar />
    </PlayerProvider>
  );
}

export default App;
