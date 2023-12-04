import React, { useState, useEffect, useContext, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from "react-bootstrap/Form";
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



    /*
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        console.log("join game field changed");
        //setLoginData((prevValues) => ({
        //  ...prevValues,
        //  [name]: value,
        //}));
      };
    */

    const handleChange = (e: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) : void => {
        console.log("join game field changed");
    };

    const handleClick = () => {
        try {
            console.log("click join game");
            //const formData = new FormData(e.currentTarget);
            //await loginUser(e, formData);
            // Handle successful login
        } catch (error) {
            // Handle login error
            console.error('Login failed', error);
        }
    };

    return (
        <div>
            <Button style={{ position: 'absolute', right: 20, top: 50 }} onClick={navigateToCreateGame}>
                Create Game
            </Button>
            <div>
                <Button style={{ position: 'absolute', right: 160, top: 50 }} onClick={handleClick}>
                    Join Game
                </Button>
                <Form.Group style={{ position: 'absolute', right: 160, top: 100, width: 100}}>
                    <Form.Select name="duration" onChange={handleChange} value={0}>
                        <option value="">Select Game to Join</option>
                        <option value="1 hour">1 Hour</option>
                        <option value="1 day">1 Day</option>
                        <option value="1 week">1 Week</option>
                        <option value="2 weeks">2 Weeks</option>
                        <option value="1 month">1 Month</option>
                    </Form.Select>
                </Form.Group>
            </div>
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
