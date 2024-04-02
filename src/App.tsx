import { useState } from "react";
import Trades from "./components/Trades";
import CoinPairSearch from "./components/CoinPairSearch";
import "./App.css";

function App() {
  const [symbol, setSymbol] = useState("BNBBTC");
  const handleChangeSymbol = (symb: string) => {
    setSymbol(symb);
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <Trades symbol={symbol} />
      <CoinPairSearch onSelectSymbol={handleChangeSymbol} />
    </div>
  );
}

export default App;
