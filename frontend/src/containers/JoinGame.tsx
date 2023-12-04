import React, { useState, useContext } from 'react';
import AuthContext from './AuthContext';  // Update with actual path to AuthContext
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { JoinGameValues } from "./interfaces";
import { useNavigate } from 'react-router-dom';

const JoinGame = () => {
    const [joinGameData, setJoinGameData] = useState<JoinGameValues>({
        game_id: "",
    });
    const navigate = useNavigate();

    const authContext = useContext(AuthContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const joinGameEndpoint = 'http://127.0.0.1:8000/join-game/';
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) : void => {
        setJoinGameData({
            ...joinGameData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!authContext || !authContext.authToken) {
            setError('User is not authenticated');
            return;
        }
        const data = {
            game_id: joinGameData.game_id,
        };

        setLoading(true);
        const { authToken } = authContext;

        fetch(joinGameEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken.access}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            return response.json();
        })
        .then(data => {
            // Handle successful game creation
            console.log('Game Joined:', data);
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

    return (
        <>
    <Form
      style={{ display: "block", width: "45%", margin: "0 auto" }}
      onSubmit={handleSubmit}
    >
      <h1>Join A Game!</h1>
      <Form.Group className="mb-3">
        <Form.Label>Game_ID: </Form.Label>
        <Form.Control
            type="text" // Changed to number
            name="game_id"
            placeholder= "ad"
            onChange={handleChange}
            value={joinGameData.game_id}
        />
        </Form.Group>
      <Button variant="primary" type="submit">
        Join Game
      </Button>
    </Form>
    </>
    );
};

export default JoinGame;
