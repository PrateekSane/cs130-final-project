import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button'; 
import AuthContext from './AuthContext';  

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
    const userGamesEndpoint = 'http://127.0.0.1:8000/user-games/';

    const navigate = useNavigate(); 

    const navigateToCreateGame = () => {
        navigate('/create-game');  // Update with the correct path to your CreateGame route
    };
    const navigateToJoinGame = () => {
        navigate('/join-game');  // Update with the correct path to your CreateGame route
    };


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

    }, [authContext]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',position: 'absolute', right: 20, top: 50 }}>
            <Button onClick={navigateToCreateGame}>
                Create Game
            </Button>
            <Button onClick = {navigateToJoinGame}>
                Join Game
            </Button>

            </div>
            <h2>User Games</h2>
            <div style={{ maxHeight: '80vh', overflowY: 'auto'}}>
            {games.length === 0 ? (
                <p>You are not in any current games!</p>
            ) : (
                <ul>
                    {games.map(game => (
                        <li key={game?.game_id}>
                            <p>Game ID: {game.game_id}</p>
                            <p>Start Time: {game.start_time}</p>
                            <p>End Time: {game.end_time}</p>
                            <p>Starting Balance: {game.starting_balance}</p>
                        </li>
                    ))}
                </ul>
            )}
            </div>
        </div>
    );
};

export default UserGames;
