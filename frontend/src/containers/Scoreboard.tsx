import GrayBox from './GrayBox'

function myDate() {
    return (new Date()).toDateString();
}

function getScoreboardPlayers(gameID: number) {
    let listOfPlayers = ["Adam", "Bob", "Charlie", "Danny"];
    if (gameID == 0) {
        listOfPlayers = ["Test0", "Test1"]
    }
    return listOfPlayers;
}

function fetchPortfolioValue(player: String) {
    if (player == "Test0") {
        return 500.00;
    }
    return 0.00;
}

// TODO:
// Loop through element list based on getScoreboardPlayers() size
// Formmatting of money value 
// Get players from API

const Scoreboard = () => {

        return (
            <div>
                <>
                    <GrayBox leftText={getScoreboardPlayers(0)[0]} rightText={"$" + fetchPortfolioValue(getScoreboardPlayers(0)[0]).toString()} />
                    <GrayBox leftText="Bob" rightText='$525.48' />
                    <GrayBox leftText="Charlie" rightText='$487.20' />
                    <GrayBox leftText="Danny" rightText='$378.43' />
                </>
                <>
                    <GrayBox leftText="test" rightText={ myDate() } />
                </>
            </div>
        )
}

export default Scoreboard