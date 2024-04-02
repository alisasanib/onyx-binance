import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { Pair } from "../../types";
import styles from "./CoinPairSearch.module.css";

interface CoinPairSearchProps {
  onSelectSymbol: (p: string) => void;
}

const CoinPairSearch: React.FC<CoinPairSearchProps> = (props) => {
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [allPairs, setAllPairs] = useState<Pair[]>([]);
  const fetchAllPairs = async () => {
    try {
      const response = await fetch("https://api.binance.com/api/v3/ticker/24hr");
      const data = await response.json();
      const filteredPairs = data.filter((pair: Pair) => parseFloat(pair.volume));
      setPairs(filteredPairs);
      setAllPairs(filteredPairs);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchAllPairs();
  }, []);
  const handleSearchPairCoin = async (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setPairs(allPairs.filter((p) => p.symbol.includes(e.target.value.toUpperCase())));
  };
  return (
    <div className={styles.coinpair_container}>
      <div style={{ position: "sticky", top: 0, background: "rgb(22, 26, 30)" }}>
        <TextField
          onChange={handleSearchPairCoin}
          id='outlined-search'
          label='Search...'
          type='search'
          sx={{ width: "80%", margin: "10px auto" }}
          InputProps={{
            // @ts-ignore
            "data-testid": "coinpair-search",
            style: {
              color: "white",
              fontFamily: "IBM Plex Sans",
              background: "rgb(43, 49, 57)",
            },
          }}
          InputLabelProps={{
            style: { color: "#fff", borderColor: "white" },
          }}
        />
      </div>
      <div style={{ margin: "0px 10px" }}>
        {pairs.map((pair) => {
          return (
            <div
              key={pair.symbol}
              data-testid='coinpair-row'
              style={{ display: "flex", fontSize: "12px", gap: 4 }}>
              <div
                onClick={() => props.onSelectSymbol(pair.symbol)}
                style={{ width: "30%", cursor: "pointer" }}>
                {pair.symbol}
              </div>
              <div
                className={parseFloat(pair.priceChange) < 0 ? styles.coinpai_drop : styles.coinpair_up}
                style={{ width: "50%" }}>
                {pair.lastPrice}
              </div>
              <div
                className={parseFloat(pair.priceChange) < 0 ? styles.coinpai_drop : styles.coinpair_up}
                style={{ width: "20%" }}>
                {pair.priceChangePercent}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoinPairSearch;
