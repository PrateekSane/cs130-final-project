import GrayBox from './GrayBox'
import fetchData from './Api'

import React, { useState, useContext } from 'react';
import AuthContext from './AuthContext';  // Update with actual path to AuthContext
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { CreateGameValues } from "./interfaces";
import { useNavigate } from 'react-router-dom';

const Stock = () => {

    const [stockData, setStockData] = useState<CreateGameValues>({
        startingBalance: 0,
        duration: '',
    });
    const navigate = useNavigate();

    const authContext = useContext(AuthContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const createGameEndpoint = 'http://127.0.0.1:8000/create-game/';
    const handleChange = (e: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) : void => {
        setStockData({
            ...stockData,
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
            starting_balance: stockData.startingBalance,
            duration: stockData.duration,
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

    const callApi = async () => {
        try {
            const result = await fetchData("/v1/images/0XYvRd7oD"); // Change to correct Url
            setStockData(result);  // Update the state with the resolved value
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle the error, e.g., set an error state or show an error message
        }  
        
        // do something with the result to display appropriately
    }

    return (
        <>
            <GrayBox leftText="APPL: 2 shares" rightText='$230.32' />
            <GrayBox leftText="TSLA: 0.5 shares" rightText='$120.12' />
            <GrayBox leftText="GME: 0.2 shares" rightText='$254.20' />
            
            <button onClick={callApi}> Button to testing api</button><br/>

            <Form
                style={{ display: "block", width: "45%", margin: "0 auto" }}
                onSubmit={handleSubmit}
            >
                <h2>Buy a stock:</h2>
                <Form.Group className="mb-3">
                    <Form.Label>Stock Name </Form.Label>
                    <Form.Control
                        type="number" // Changed to number
                        name="startingBalance"
                        placeholder="0"
                        onChange={handleChange}
                        value={stockData.startingBalance}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Number of Shares: </Form.Label>
                    <Form.Control
                        type="number" // Changed to number
                        name="startingBalance"
                        placeholder="0"
                        onChange={handleChange}
                        value={stockData.startingBalance}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Buy or Sell: </Form.Label>
                    <Form.Select name="duration" onChange={handleChange} value={stockData.duration}>
                        <option value="Buy">Buy</option>
                        <option value="Sell">Sell</option>
                    </Form.Select>

                </Form.Group>
                <Button variant="primary" type="submit">
                    Perform Action on Stock
                </Button>
            </Form>
        </>
        
    )
}

export default Stock