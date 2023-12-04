import GrayBox from './GrayBox'
import React, { useState, useContext, FormEvent } from "react";
import {jwtDecode} from "jwt-decode";
import AuthContext, { AuthProvider } from "./AuthContext";
import { parseJsonText } from 'typescript';

function myDate() {
    return (new Date()).toDateString();
}

function getScoreboardPlayersDebug(gameID: number) {
    let listOfPlayers = ["Adam", "Bob", "Charlie", "Danny"];
    if (gameID == 0) {
        listOfPlayers = ["Test0", "Test1"]
    }
    return listOfPlayers;
}

function fetchPortfolioValueDebug(player: String) {
    if (player == "Test0") {
        return 500.00;
    }
    return 0.00;
}

// TODO:
// Loop through element list based on getScoreboardPlayers() size
// Formmatting of money value 
// Get players from API

let my_players: String[] = [];
//let my_players = "waiting";

//async function getScoreboard() {
const getScoreboard = async () => {
    const response = await fetch('http://127.0.0.1:8000/view_scoreboard/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: localStorage.getItem('email'), password: localStorage.getItem('password')})
    });

    const data = await response.json();
    console.log(data["players"]);

    //my_players = "finished";
    my_players = data["players"];
    console.log(my_players);
    
    return data["players"];
  };

const Scoreboard = () => {

    if (!AuthContext) {
        return (<></>);
    }

    //console.log(localStorage.getItem('authtoken'));

    //let userjson = JSON.parse(((String)(localStorage.getItem('authtoken'))));
    //console.log(jwtDecode<User>(userjson.access));
    console.log(localStorage.getItem('email'));
    console.log(localStorage.getItem('password'));

    //getScoreboard().then(data =>);
    console.log(my_players);

    return (
        <div>
            <>
                <GrayBox leftText={getScoreboardPlayersDebug(0)[0]} rightText={"$" + fetchPortfolioValueDebug(getScoreboardPlayersDebug(0)[0]).toString()} />
                <GrayBox leftText="Bob" rightText='$525.48' />
                <GrayBox leftText="Charlie" rightText='$487.20' />
                <GrayBox leftText="Danny" rightText='$378.43' />
            </>
            <>{my_players}</>
        </div>
    )
}

export default Scoreboard