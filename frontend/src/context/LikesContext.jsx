import { createContext, useContext, useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "../config/api";
import { useAuth } from "./AuthContext";

const LikesContext = createContext();

export function LikesProvider({ children }) {
  const { token } = useAuth();
  const [likedIds, setLikedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLikedIds(new Set());
      setLoading(false);
      return;
    }

    setLoading(true);

    apiGet("/tracks/likes", token)
      .then((ids) => {
        // 🔑 IMPORTANT: normalize everything to string
        const normalized = new Set(ids.map(String));
        setLikedIds(normalized);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const like = async (trackId) => {
    await apiPost(`/tracks/${trackId}/like`, {}, token);
    setLikedIds((prev) => new Set([...prev, String(trackId)]));
  };

  const unlike = async (trackId) => {
    await apiDelete(`/tracks/${trackId}/like`, token);
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.delete(String(trackId));
      return next;
    });
  };

  return (
    <LikesContext.Provider
      value={{ likedIds, like, unlike, loading }}
    >
      {children}
    </LikesContext.Provider>
  );
}

export function useLikes() {
  return useContext(LikesContext);
}
