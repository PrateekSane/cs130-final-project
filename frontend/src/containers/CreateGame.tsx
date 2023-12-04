import React, { useState, useContext } from 'react';
import AuthContext from './AuthContext';  // Update with actual path to AuthContext
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { CreateGameValues } from "./interfaces";
import { useNavigate } from 'react-router-dom';

const CreateGame = () => {
    const [createGameData, setCreateGameData] = useState<CreateGameValues>({
        startingBalance: 0,
        duration: '',
    });
    const navigate = useNavigate();

    const authContext = useContext(AuthContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const createGameEndpoint = 'http://127.0.0.1:8000/create-game/';
    const handleChange = (e: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) : void => {
        setCreateGameData({
            ...createGameData,
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
            starting_balance: createGameData.startingBalance,
            duration: createGameData.duration,
        };

        setLoading(true);
        const { authToken } = authContext;

        fetch(createGameEndpoint, {
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
            console.log('Game created:', data);
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
      <h1>Sign Up here!</h1>
      <Form.Group className="mb-3">
        <Form.Label>Starting Balance: </Form.Label>
        <Form.Control
            type="number" // Changed to number
            name="startingBalance"
            placeholder="0"
            onChange={handleChange}
            value={createGameData.startingBalance}
        />
        </Form.Group>
      <Form.Group className="mb-3">
      <Form.Label>Duration: </Form.Label>
        <Form.Select name="duration" onChange={handleChange} value={createGameData.duration}>
            <option value="">Select Duration</option>
            <option value="1 hour">1 Hour</option>
            <option value="1 day">1 Day</option>
            <option value="1 week">1 Week</option>
            <option value="2 weeks">2 Weeks</option>
            <option value="1 month">1 Month</option>
        </Form.Select>

      </Form.Group>
      <Button variant="primary" type="submit">
        Create Game
      </Button>
    </Form>
    </>
    );
};

export default CreateGame;
