import { useState } from "react";
import Trades from "./components/Trades";
import "./App.css";

function App() {
  const [symbol, setSymbol] = useState("BNBBTC");
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <Trades symbol={symbol} />
    </div>
  );
}

export default App;
