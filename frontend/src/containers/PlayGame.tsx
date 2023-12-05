import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { StringMappingType } from "typescript";
import AuthContext from "./AuthContext";
import "./game.css";
import { InteractWithHoldingValues } from "./interfaces";

interface Game {
  game_id: string;
  start_time: string;
  end_time: string | null;
  starting_balance: number;
}

const sampleHoldings = [
  ["AAPL", 5],
  ["GME", 3],
  ["NVDA", 1],
];

const sampleScores = [
  ["Bob", 5],
  ["Joe", 10],
  ["Bruin", 7],
];

const PlayGame = () => {
  const authContext = useContext(AuthContext);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [idToPlay, setIDToPlay] = useState<string | null>(null);
  const [holdings, setHoldings] = useState(sampleHoldings);
  const [scores, setScores] = useState(sampleScores);
  const [auth, setAuth] = useState<any>();

  const userGamesEndpoint = "http://127.0.0.1:8000/user-games/";
  const stockDataEndpoint = "http://127.0.0.1:8000/interact-with-holding/";
  const holdingsEndpoint = "http://127.0.0.1:8000/get-player-holdings/";

  const [stockData, setStockData] = useState<InteractWithHoldingValues>({
    symbol: "",
    game_id: "",
    shares: "",
  });
  const fetchHoldings = async (authToken: any) => {
    const data = { portfolio_id: 33 };
    fetch(holdingsEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response for hodlings was not ok");
      }
      const res = await response.json();
      console.log(res.holdings);
      return res.holdings;
    });
  };

  useEffect(() => {
    if (!authContext || !authContext.user || !authContext.authToken) {
      setError("User is not authenticated");
      setLoading(false);
      return;
    }

    const { authToken } = authContext;
    setAuth(authToken);
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
          console.log(formattedGames);
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
    console.log(
      "localStorage.getItem('selectedGame')",
      localStorage.getItem("selectedGame")
    );
    setIDToPlay(localStorage.getItem("selectedGame"));
    setStockData({
      ...stockData,
      game_id: localStorage.getItem("selectedGame"),
    });

    const holdings = fetchHoldings(authToken);
  }, [authContext]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>
  ): void => {
    setStockData({
      ...stockData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!authContext || !authContext.authToken) {
      setError("User is not authenticated");
      return;
    }
    const data = {
      symbol: stockData.symbol,
      game_id: stockData.game_id,
      shares: stockData.shares,
    };

    setLoading(true);
    const { authToken } = authContext;

    fetch(stockDataEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Network response for buying and selling stocks was not ok"
          );
        }

        return response.json();
      })
      .then((data) => {
        // Handle successful game creation
        console.log("Stocks bought or sold:", data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const enterGame = (game_id: React.SetStateAction<string | null>) => {
    console.log(game_id);
    setIDToPlay(game_id);
  };

  return (
    <>
      <div className="game-wrapper">
        <Form onSubmit={handleSubmit}>
          <h2>Buy/Sell a stock:</h2>
          <Form.Group className="mb-3">
            <Form.Label>Stock Name </Form.Label>
            <Form.Control
              type="string" // Changed to number
              name="symbol"
              placeholder="AAPL"
              onChange={handleChange}
              value={stockData.symbol}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Number of Shares <br />
              (Input a positive number to buy, and negative number to sell):{" "}
            </Form.Label>
            <Form.Control
              type="text" // Changed to number
              name="shares"
              placeholder=""
              onChange={handleChange}
              value={stockData.shares}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Buy/Sell Stock
          </Button>
        </Form>
        <div className="holding-list">
          <h2>Your Holdings</h2>
          {holdings.length === 0 ? (
            <p>You don't have any holdings</p>
          ) : (
            <ul>
              {holdings.map((stock, index) => (
                <li key={index}>
                  {stock[0]}: {stock[1]} shares
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="scoreboard-wrapper">
        <h2>Game Scoreboard</h2>
        {scores.length &&
          (scores as [string, number][])
            .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
            .map((score, index) => (
              <p key={index}>
                {score[0]}: {score[1]}
              </p>
            ))}
      </div>
      <button onClick={() => fetchHoldings(auth)}>fetch</button>
    </>
  );
};

export default PlayGame;
