import { createContext, useContext, useEffect, useState } from "react";
import { apiPost } from "../config/api";
import { usePlayer } from "./PlayerContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // 🔑 access player reset safely
  const { resetPlayer } = usePlayer();

  /* =========================
     INIT FROM STORAGE
  ========================= */
  useEffect(() => {
    setLoading(false);
  }, []);

  /* =========================
     LOGIN
  ========================= */
  const login = async (email, password) => {
    const res = await apiPost("/auth/login", { email, password });
    localStorage.setItem("token", res.access_token);
    setToken(res.access_token);
  };

  /* =========================
     SIGNUP
  ========================= */
  const signup = async (email, password) => {
    await apiPost("/auth/signup", { email, password });
  };

  /* =========================
     LOGOUT (SAFE)
  ========================= */
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    resetPlayer(); // 🔒 stops audio + clears queue + clears player state
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
