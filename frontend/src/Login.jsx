import { useState } from "react";
import { useAuth } from "./context/AuthContext";

export default function Login() {
  const { login, signup } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // login | signup
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password);
        alert("Signup successful. Please login.");
        setMode("login");
      }
    } catch (err) {
      setError(err?.message || "Authentication failed");
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "100px auto",
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 6,
      }}
    >
      <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />

        {error && (
          <div style={{ color: "red", marginBottom: 10 }}>{error}</div>
        )}

        <button type="submit" style={{ width: "100%" }}>
          {mode === "login" ? "Login" : "Sign Up"}
        </button>
      </form>

      <div style={{ marginTop: 10, textAlign: "center" }}>
        {mode === "login" ? (
          <span>
            New user?{" "}
            <button onClick={() => setMode("signup")}>Sign up</button>
          </span>
        ) : (
          <span>
            Already have an account?{" "}
            <button onClick={() => setMode("login")}>Login</button>
          </span>
        )}
      </div>
    </div>
  );
}
