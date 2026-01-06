import { createContext, useContext, useEffect, useRef, useState } from "react";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [activePlaylist, setActivePlaylist] = useState(null);

  /* =========================
     RESTORE FROM STORAGE
  ========================= */
  useEffect(() => {
    const saved = localStorage.getItem("wavecast-player");
    if (!saved) return;

    try {
      const { track, time } = JSON.parse(saved);
      if (!track || !audioRef.current) return;
      audioRef.current.src = track.audio_url;

    const onLoaded = () => {
      audioRef.current.currentTime = time || 0;
    };

    audioRef.current.addEventListener("loadedmetadata", onLoaded);
    setCurrentTrack(track);
    setIsPlaying(false); // do NOT autoplay on refresh

    return () => {
      audioRef.current?.removeEventListener("loadedmetadata", onLoaded);
    };
   } catch {}
  }, []);

  /* =========================
     LOAD TRACK
  ========================= */
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    audioRef.current.src = currentTrack.audio_url;
    audioRef.current.load();

    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    }
  }, [currentTrack]);

  /* =========================
     PLAY / PAUSE
  ========================= */
  useEffect(() => {
    if (!audioRef.current) return;

    isPlaying
      ? audioRef.current.play().catch(() => {})
      : audioRef.current.pause();
  }, [isPlaying]);

  /* =========================
     AUTO NEXT
  ========================= */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (queue.length > 0 && queueIndex < queue.length - 1) {
        const next = queueIndex + 1;
        setQueueIndex(next);
        setCurrentTrack(queue[next]);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [queue, queueIndex]);

  /* =========================
     ACTIONS
  ========================= */
  const playTrack = (track) => {
    setQueue([]);
    setQueueIndex(0);
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const playPlaylist = (tracks) => {
    if (!tracks?.length) return;
    setQueue(tracks);
    setQueueIndex(0);
    setCurrentTrack(tracks[0]);
    setIsPlaying(true);
  };

  const resetPlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setCurrentTrack(null);
    setQueue([]);
    setQueueIndex(0);
    setIsPlaying(false);
    setActivePlaylist(null);
    localStorage.removeItem("wavecast-player");
  };

  return (
    <PlayerContext.Provider
      value={{
        audioRef,
        currentTrack,
        isPlaying,
        setIsPlaying,
        playTrack,
        playPlaylist,
        resetPlayer,
        activePlaylist,
        setActivePlaylist,
      }}
    >
      {children}
      <audio ref={audioRef} />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
