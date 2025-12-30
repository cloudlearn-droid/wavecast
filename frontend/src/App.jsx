import { useState } from "react";
import WaveVisualizer from "./player/WaveVisualizer";
import Artists from "./pages/Artists";
import ArtistTracks from "./pages/ArtistTracks";

function App() {
  const [selectedArtist, setSelectedArtist] = useState(null);

  return (
    <>
      <WaveVisualizer />

      {selectedArtist ? (
        <ArtistTracks
          artist={selectedArtist}
          onBack={() => setSelectedArtist(null)}
        />
      ) : (
        <Artists onSelectArtist={setSelectedArtist} />
      )}
    </>
  );
}

export default App;
