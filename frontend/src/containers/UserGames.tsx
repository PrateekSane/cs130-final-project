import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button'; 
import AuthContext from './AuthContext';  

interface Game {
    game_id: number;
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

    useEffect(() => {
        if (!authContext || !authContext.user || !authContext.authToken) {
            setError('User is not authenticated');
            setLoading(false);
            return;
        }

        const { authToken } = authContext;

        console.log(authToken);

        fetch(userGamesEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken.access}`,
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (!response.ok) {
                console.log(response);
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (Array.isArray(data.games)) {
                const formattedGames = data.games.map((game: any) => game.fields);
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
            <Button style={{ position: 'absolute', right: 20, top: 50 }} onClick={navigateToCreateGame}>
                Create Game
            </Button>
            <h2>User Games</h2>
            {games.length === 0 ? (
                <p>You are not in any current games!</p>
            ) : (
                <ul>
                    {games.map(game => (
                        <li key={game.game_id}>
                            <p>Game ID: {game.game_id}</p>
                            <p>Start Time: {game.start_time}</p>
                            <p>End Time: {game.end_time}</p>
                            <p>Starting Balance: {game.starting_balance}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserGames;
