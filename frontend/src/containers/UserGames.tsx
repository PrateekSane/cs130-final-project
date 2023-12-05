import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import "./game.css";
import PlayGame from "./PlayGame";

interface Game {
  game_id: string;
  start_time: string;
  end_time: string | null;
  starting_balance: number;
}

const UserGames = () => {
  const authContext = useContext(AuthContext);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userGamesEndpoint = "http://127.0.0.1:8000/user-games/";

  const navigate = useNavigate();

  const navigateToCreateGame = () => {
    navigate("/create-game"); // Update with the correct path to your CreateGame route
  };
  const navigateToJoinGame = () => {
    navigate("/join-game"); // Update with the correct path to your CreateGame route
  };

  const enterGame = (game_id: string) => {
    //navigate(`/game/${game_id}`);
    navigate("/play-game");
    console.log("entered play-game but using enterGame to init");
    localStorage.setItem('selectedGame', game_id);
  };

  const formatTime = (timestamp: string | null): string => {
    if (timestamp == null) return "";
    const dateObject = new Date(timestamp);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = dateObject.toLocaleDateString("en-US", options);
    return formattedDate;
  };

  useEffect(() => {
    if (!authContext || !authContext.user || !authContext.authToken) {
      setError("User is not authenticated");
      setLoading(false);
      return;
    }

    const { authToken } = authContext;

    fetch(userGamesEndpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken.access}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (Array.isArray(data.games)) {
          const formattedGames = data.games.map((game: any) => game);
          setGames(formattedGames);
        } else {
          setGames([]); // Sets games to an empty array if data.games is not an array
        }

        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [authContext]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="game-list">
      <h2>User Games</h2>
      <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
        {games.length === 0 || !games? (
          <p>You are not in any current games!</p>
        ) : (
          <ul>
            {games.map((game) => (
              <li key={game?.game_id}>
                <p>Game ID: {game.game_id}</p>
                <p>Start Time: {formatTime(game.start_time)}</p>
                <p>End Time: {formatTime(game.end_time)}</p>
                <p>Starting Balance: {game.starting_balance}</p>
                <button onClick={() => enterGame(game.game_id)}>
                  Enter Game
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button onClick={navigateToCreateGame}>Create Game</button>
        <button onClick={navigateToJoinGame}>Join Game</button>
      </div>
    </div>
  );
};

export default UserGames;

// <p>Number iof Players: {game.player_profiles.length}</p>
