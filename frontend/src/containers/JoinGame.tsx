import GrayBox from './GrayBox'
import React, { useState, useContext, FormEvent } from "react";
import {jwtDecode} from "jwt-decode";
import AuthContext, { AuthProvider } from "./AuthContext";
import { parseJsonText } from 'typescript';
import Scoreboard from './Scoreboard';

const JoinGame = () => {
    return (
        <div>
            <>
                <GrayBox leftText="Charlie" rightText='$487.20' />
                <GrayBox leftText="Danny" rightText='$378.43' />
            </>
        </div>
    )
}

export default JoinGame;