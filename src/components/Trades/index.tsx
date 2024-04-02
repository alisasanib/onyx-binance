import { useCallback, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { binanceStream } from "../../websocket";
import { Trade } from "../../types";
import styles from "./Trades.module.css";

interface TradesProps {
  symbol: string;
}

const Trades: React.FC<TradesProps> = (props) => {
  const [data, setData] = useState<Trade[]>([]);
  const [symbol, setSymbol] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMessage = useCallback((m: any) => {
    if (m.e === "trade") {
      const { p: price, q: qty, t: id, T: time, m: isBuyerMaker } = m;
      const date = new Date(time);

      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      updateData({
        price,
        qty,
        id,
        time: `${hours}:${minutes}:${seconds}`,
        isBuyerMaker,
      });
    }
  }, []);

  useEffect(() => {
    setSymbol(props.symbol);
    setData([]);
  }, [props.symbol]);

  useEffect(() => {
    let tradeDestroyer: () => void;
    if (!symbol) return;
    setIsLoading(true);

    const initWebSocket = () => {
      const obj = {
        method: "SUBSCRIBE",
        params: [`${symbol.toLowerCase()}@trade`],
        id: 1,
      };
      binanceStream.send(obj);
      tradeDestroyer = binanceStream.onMessage((event: any) => {
        if (event.e !== "trade") return;

        handleMessage(event);
      }, "trade");
    };

    fetch(`https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=30`)
      .then((response) => {
        return response.json();
      })
      .then((data: Trade[]) => {
        const timeUpdated = data
          ?.sort((a, b) => ((a.time as number) - (b.time as number) > 0 ? -1 : 1))
          .map((d) => {
            const date = new Date(d.time);

            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");
            const seconds = date.getSeconds().toString().padStart(2, "0");
            return { ...d, time: `${hours}:${minutes}:${seconds}` };
          });
        setData(timeUpdated);
      })
      .finally(() => {
        setIsLoading(false);
      });
    initWebSocket();
    return () => {
      const obj = {
        method: "UNSUBSCRIBE",
        params: [`${symbol.toLowerCase()}@trade`],
        id: 1,
      };
      binanceStream.send(obj);
      if (tradeDestroyer) tradeDestroyer();
    };
  }, [symbol]);

  const updateData = (newItem: any) => {
    setData((prevData) => {
      const newData = [newItem, ...prevData.slice(0, -1)];
      return newData;
    });
  };

  if (isLoading) {
    return (
      <div className={`${styles.trades_container} ${styles.trades_container_loading}`}>
        <CircularProgress sx={{ color: "#F3BA2F" }} />
      </div>
    );
  }

  return (
    <div className={styles.trades_container}>
      <div className={styles.trade_title}>Market Trades</div>
      <div
        style={{
          display: "flex",
        }}>
        <div className={styles.trade_header}>id</div>
        <div className={styles.trade_header}>price</div>
        <div className={styles.trade_header}>Quantity</div>
        <div className={styles.trade_header}>Time</div>
      </div>
      {data.map((trade) => {
        return (
          <div
            key={trade.id}
            data-testid='trade-row'
            style={{
              display: "flex",
            }}>
            <div className={styles.trade_row}>{trade.id}</div>
            <div
              style={
                trade.isBuyerMaker
                  ? {
                      color: "green",
                    }
                  : {
                      color: "red",
                    }
              }
              className={styles.trade_row}>
              {trade.price}
            </div>
            <div className={styles.trade_row}>{trade.qty}</div>
            <div className={styles.trade_row}>{trade.time}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Trades;
