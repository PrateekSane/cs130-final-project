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

interface HoldingType {
    symbol: string;
    quantity: number;
}

interface Payload {
    fields: any;
}

interface PlayerProfileType {
    username: string;
    current_balance: number;
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
  const [holdings, setHoldings] = useState<HoldingType[]>([]);
  const [scoreBoardProfiles, setScoreboardProfiles] = useState<PlayerProfileType[]>([]);
  const [cash, setCash] = useState<number>(0);
  const [scores, setScores] = useState(sampleScores);
  
  const userGamesEndpoint = "http://127.0.0.1:8000/user-games/";
  const stockDataEndpoint = "http://127.0.0.1:8000/interact-with-holding/";
  const gameAndPlayerDataEndpoint = "http://127.0.0.1:8000/game-player-data/";
  const scoreboardEndpoint = "http://127.0.0.1:8000/get-scoreboard/";

  const [stockData, setStockData] = useState<InteractWithHoldingValues>({
    symbol: "",
    game_id: "",
    shares: "",
  });
  useEffect(() => {
    if (!authContext || !authContext.user || !authContext.authToken) {
      setError("User is not authenticated");
      setLoading(false);
      return;
    }

    const { user,authToken } = authContext;
    console.log(
        "localStorage.getItem('selectedGame')",
        localStorage.getItem("selectedGame")
      );
    setIDToPlay(localStorage.getItem("selectedGame"));
    setStockData({
    ...stockData,
    game_id: localStorage.getItem("selectedGame"),
    });

    fetch(gameAndPlayerDataEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({game_id: localStorage.getItem("selectedGame")}),

    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const game_player_data = data.game_and_player_data;
        const holdings_payload = game_player_data.slice(3); // Gets elements from the 3rd to the end

        const player_profile = game_player_data[1].fields;


        const mappedHoldings = holdings_payload.map((holding:Payload) => ({
            symbol: holding.fields.stock_symbol,
            quantity: holding.fields.shares
        }));
        setCash(player_profile.current_balance);
        setHoldings(mappedHoldings);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });

      fetch(scoreboardEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({game_id: localStorage.getItem("selectedGame")}),
  
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const scoreboard_profiles = data.scoreboard_profiles;
        const mappedScoreboardProfiles = scoreboard_profiles.map((profile : Payload) => ({
            username: profile.fields.username,
            current_balance: profile.fields.current_balance
        }));
        setScoreboardProfiles(mappedScoreboardProfiles);
        setLoading(false);


      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
    
  }, [authContext, loading]);

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
          <h2>Your Purchase History</h2>

          {holdings.length === 0 || !holdings ? (
            <p>You don't have any holdings</p>
          ) : (
            <ul>
              {holdings.map((stock, index) => (
                <li key={index}>
                  {stock.symbol}: {stock.quantity} shares
                </li>
              ))}
            </ul>
          )}
          <p>Cash: </p> {cash}
        </div>
      </div>
      <div className="scoreboard-wrapper">
        <h2>Cash Reserves:</h2>
        {scoreBoardProfiles.length &&
            scoreBoardProfiles.map((profile, index) => (
              <p key={index}>
                {profile.username}: {profile.current_balance}
              </p>
            ))}
      </div>
    </>
  );
};

export default PlayGame;

// (idToPlay === null || localStorage.getItem('selectedGame') === null) ? (
//     <>
//         <div>
//             <h2>User Games</h2>
//             <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
//                 {games.length === 0 ? (
//                     <p>You are not in any current games!</p>
//                 ) : (
//                     <ul>
//                         {games.map(game => (
//                             <div>
//                                 <li key={game?.game_id}>
//                                     <p>Game ID: {game.game_id}</p>
//                                     <p>Start Time: {game.start_time}</p>
//                                     <p>End Time: {game.end_time}</p>
//                                     <p>Starting Balance: {game.starting_balance}</p>
//                                 </li>
//                                 <button onClick={() => { enterGame(game.game_id) }}>Play</button>
//                             </div>
//                         ))}
//                     </ul>
//                 )}
//             </div>

//         </div>
//     </>
// ) : (
