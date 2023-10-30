import React from "react";
import './GrayBox.css';

interface GrayBoxProps {
    leftText: string;
    rightText: string;
}

const GrayBox: React.FC<GrayBoxProps> = ({ leftText, rightText }) => {
    return (
        <div className="gray-box">
            <div className="left-text"> {leftText} </div>
            <div className="right-text"> {rightText} </div>
        </div>
    )
}

export default GrayBox;