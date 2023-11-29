import { useState } from "react";
import fetchData from "./Api";
import GrayBox from "./GrayBox";

const Stock = () => {
  const [stockData, setStockData] = useState({}); // add typescript interface based on types of res

  const callApi = async () => {
    try {
      const result = await fetchData("/v1/images/0XYvRd7oD"); // Change to correct Url
      if (result) setStockData(result.data); // Update the state with the resolved value
      console.log(stockData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error, e.g., set an error state or show an error message
    }

    // do something with the result to display appropriately
  };

  return (
    <>
      <GrayBox leftText="APPL: 2 shares" rightText="$230.32" />
      <GrayBox leftText="TSLA: 0.5 shares" rightText="$120.12" />
      <GrayBox leftText="GME: 0.2 shares" rightText="$254.20" />

      <button onClick={callApi}> Button to testing api</button>
      <br />
    </>
  );
};

export default Stock;
