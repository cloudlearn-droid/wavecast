import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { PlayerProvider } from "./context/PlayerContext";
import { LikesProvider } from "./context/LikesContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PlayerProvider>
      <AuthProvider>
        <LikesProvider>
          <App />
        </LikesProvider>
      </AuthProvider>
    </PlayerProvider>
  </React.StrictMode>
);
