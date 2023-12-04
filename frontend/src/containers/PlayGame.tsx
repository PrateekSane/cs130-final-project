import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import AuthContext from './AuthContext';
import Form from "react-bootstrap/Form";

import { InteractWithHoldingValues } from "./interfaces";

interface Game {
    game_id: string;
    start_time: string;
    end_time: string | null;
    starting_balance: number;
}

const PlayGame = () => {
    const authContext = useContext(AuthContext);
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [idToPlay, setIDToPlay] = useState<string | null>(null);

    const userGamesEndpoint = 'http://127.0.0.1:8000/user-games/';
    const stockDataEndpoint = 'http://127.0.0.1:8000/interact-with-holding/';

    const [stockData, setStockData] = useState<InteractWithHoldingValues>({
        symbol: "",
        game_id: "",
        shares: ""
    });

    useEffect(() => {
        if (!authContext || !authContext.user || !authContext.authToken) {
            setError('User is not authenticated');
            setLoading(false);
            return;
        }

        const { authToken } = authContext;

        fetch(userGamesEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken.access}`,
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
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
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
        console.log("localStorage.getItem('selectedGame')", localStorage.getItem('selectedGame'));
        setIDToPlay(localStorage.getItem('selectedGame'));
        setStockData({...stockData, game_id:localStorage.getItem('selectedGame')});
    }, [authContext]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>): void => {
        setStockData({
            ...stockData,
            [e.target.name]: e.target.value
        });
    };


    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!authContext || !authContext.authToken) {
            setError('User is not authenticated');
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
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken.access}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response for buying and selling stocks was not ok');
                }

                return response.json();
            })
            .then(data => {
                // Handle successful game creation
                console.log('Stocks bought or sold:', data);
                navigate("/games");
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const enterGame = (game_id: React.SetStateAction<string | null>) => {
        console.log(game_id);
        setIDToPlay(game_id);
    }

    return (

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
        <>
            <Form
                style={{ display: "block", width: "45%", margin: "0 auto" }}
                onSubmit={handleSubmit}
            >
                <h2>Buy/Sell a stock:</h2>
                <Form.Group className="mb-3">
                    <Form.Label>Stock Name </Form.Label>
                    <Form.Control
                        type="string" // Changed to number
                        name="symbol"
                        placeholder="APPL"
                        onChange={handleChange}
                        value={stockData.symbol}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Number of Shares(Input a positive number to buy, and negative number to sell): </Form.Label>
                    <Form.Control
                        type="text" // Changed to number
                        name="shares"
                        placeholder="asd"
                        onChange={handleChange}
                        value={stockData.shares}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Perform Action on Stock
                </Button>
            </Form>
        </>
    )
    // );
};

export default PlayGame;
