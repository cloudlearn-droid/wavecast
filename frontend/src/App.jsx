import { useAuth } from "./context/AuthContext";
import Login from "./Login";
import Home from "./Home";
import PlayerBar from "./components/PlayerBar";

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {isAuthenticated ? <Home /> : <Login />}
      <PlayerBar />
    </>
  );
}
