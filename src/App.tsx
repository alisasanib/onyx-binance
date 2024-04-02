import { useState } from "react";
import { Grid } from "@mui/material";
import Header from "./components/Header";
import Chart from "./components/Chart";
import Trades from "./components/Trades";
import CoinPairSearch from "./components/CoinPairSearch";
import styles from "./App.module.css";

function App() {
  const [symbol, setSymbol] = useState("BNBBTC");
  const handleChangeSymbol = (symb: string) => {
    setSymbol(symb);
  };
  return (
    <div className={styles.app_container}>
      <Header />
      <div className={styles.selected_pair}>{symbol}</div>
      <Grid
        className={styles.content_container}
        container
        spacing={2}>
        <Grid
          sx={{ paddingTop: "10px" }}
          item
          xl={3}
          lg={12}
          md={12}
          xs={12}>
          <div className={styles.left_panel_container}>
            <Trades symbol={symbol} />
            <CoinPairSearch onSelectSymbol={handleChangeSymbol} />
          </div>
        </Grid>
        <Grid
          item
          sx={{ paddingTop: "10px" }}
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
