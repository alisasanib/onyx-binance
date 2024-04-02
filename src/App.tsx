import { useState } from "react";
import { Grid } from "@mui/material";
import Header from "./components/Header";
import Chart from "./components/Chart";
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
      <Header />
      <Grid
        sx={{ marginTop: 0 }}
        className='content-container'
        container
        spacing={4}>
        <Grid
          item
          xl={3}
          lg={12}
          md={12}
          xs={12}>
          <div>
            <Trades symbol={symbol} />
            <CoinPairSearch onSelectSymbol={handleChangeSymbol} />
          </div>
        </Grid>
        <Grid
          item
          xl={9}
          lg={12}
          md={12}
          xs={12}>
          <Chart symbol={symbol} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
