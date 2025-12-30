import { createContext, useContext, useState } from "react";
import { playTrack as enginePlay } from "./audioEngine";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = (track) => {
    enginePlay(track.audio_url);
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pause = () => {
    // simple pause using HTMLAudioElement
    if (window.__wavecast_audio__) {
      window.__wavecast_audio__.pause();
      setIsPlaying(false);
    }
  };

  return (
    <PlayerContext.Provider
      value={{ currentTrack, isPlaying, play, pause }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
