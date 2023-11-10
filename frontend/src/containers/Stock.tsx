import React from 'react'
import GrayBox from './GrayBox'


const Stock = () => {
    return (
        <>
            <GrayBox leftText="APPL: 2 shares" rightText='$230.32' />
            <GrayBox leftText="TSLA: 0.5 shares" rightText='$120.12' />
            <GrayBox leftText="GME: 0.2 shares" rightText='$254.20' />
        </>
        
    )
}

export default Stock