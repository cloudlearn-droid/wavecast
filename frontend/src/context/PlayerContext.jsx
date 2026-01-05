import { createContext, useContext, useEffect, useState } from "react";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);

  // 🔁 Restore full track on refresh
  useEffect(() => {
    const saved = localStorage.getItem("wavecast-player");
    if (!saved) return;

    const parsed = JSON.parse(saved);
    if (parsed.track) {
      setCurrentTrack(parsed.track);
    }
  }, []);

  // 💾 Persist full track when changed
  useEffect(() => {
    if (!currentTrack) return;

    const saved = localStorage.getItem("wavecast-player");
    const prev = saved ? JSON.parse(saved) : {};

    localStorage.setItem(
      "wavecast-player",
      JSON.stringify({
        ...prev,
        track: currentTrack,
      })
    );
  }, [currentTrack]);

  return (
    <PlayerContext.Provider value={{ currentTrack, setCurrentTrack }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
