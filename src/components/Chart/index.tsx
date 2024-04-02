import { useCallback, useEffect, useRef, useState } from "react";
import {
  ISeriesApi,
  SeriesDataItemTypeMap,
  SeriesOptionsMap,
  SeriesPartialOptionsMap,
  Time,
  createChart,
} from "lightweight-charts";
import { debounce } from "lodash-es";
import { binanceStream } from "../../websocket";
import { BinanceMessage, HistoricalDataType } from "../../types";
import { CircularProgress } from "@mui/material";
import styles from "./Chart.module.css";

interface CandlestickChartProps {
  symbol: string;
}

const CandlestickChart: React.FC<CandlestickChartProps> = (props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalDataType[]>([]);
  const [visibleRange, setVisibleRange] = useState<{ from: number; to: number } | null>(null);
  const [symbol, setSymbol] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chartRef: React.MutableRefObject<ISeriesApi<"Candlestick"> | null> = useRef<ISeriesApi<"Candlestick">>(null);

  const onRangeChange = useCallback(
    async (chart: any) => {
      const visRange = chart.timeScale().getVisibleRange();

      setVisibleRange(visRange);
    },
    [symbol]
  );

  const renderChart = useCallback(
    (chart: any) => {
      const candlestickSeries = chart.addCandlestickSeries({
        priceFormat: {
          minMove: 0.0000001,
          precision: 7,
        },
      });

      const formattedData = historicalData.map((item) => ({
        time: (item[0] / 1000) as Time,
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
      }));

      chart.timeScale().subscribeVisibleTimeRangeChange(debounce(() => onRangeChange(chart), 3000));

      candlestickSeries.setData(formattedData);
      return candlestickSeries;
    },
    [historicalData, onRangeChange]
  );

  useEffect(() => {
    setSymbol((prevState) => {
      if (prevState) {
        const obj = {
          method: "UNSUBSCRIBE",
          params: [`${prevState.toLowerCase()}@kline_1h`],
          id: 1,
        };
        binanceStream.send(obj);
      }
      return props.symbol;
    });
  }, [props.symbol]);

  useEffect(() => {
    let klineDestroyer: () => void;
    if (!symbol) return;
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d`);
        const data = await response.json();
        setHistoricalData(data);
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    };

    const initWebSocket = () => {
      const obj = {
        method: "SUBSCRIBE",
        params: [`${symbol.toLowerCase()}@kline_1h`],
        id: 1,
      };
      binanceStream.send(obj);
      klineDestroyer = binanceStream.onMessage((event: BinanceMessage) => {
        if (event.e !== "kline") return;

        updateChart(event);
      }, "kline");
    };

    const updateChart = (message: BinanceMessage) => {
      const candlestickSeries = chartRef?.current;

      const formattedData = {
        time: (message.k.t / 1000) as Time,
        open: parseFloat(message.k.o),
        high: parseFloat(message.k.h),
        low: parseFloat(message.k.l),
        close: parseFloat(message.k.c),
      };

      candlestickSeries?.update(formattedData);
    };
    setIsLoading(true);
    fetchData().finally(() => {
      setIsLoading(false);
    });
    initWebSocket();

    return () => {
      const obj = {
        method: "UNSUBSCRIBE",
        params: [`${symbol.toLowerCase()}@kline_1h`],
        id: 1,
      };
      binanceStream.send(obj);
      if (klineDestroyer) klineDestroyer();
    };
  }, [symbol]);

  useEffect(() => {
    if (!symbol || !visibleRange) return;
    const fetchMoreData = async () => {
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&endTime=` + visibleRange.from * 1000
      );
      const data = await response.json();
      data.splice(-1);
      if (data.length) setHistoricalData((prevState) => [...data, ...prevState]);
    };
    if (visibleRange && visibleRange.from === historicalData[0][0] / 1000) {
      fetchMoreData();
    }
  }, [visibleRange]);

  useEffect(() => {
    let chart = chartRef?.current;
    if (historicalData.length > 0 && !chartRef?.current) {
      chart = createChart(containerRef.current as HTMLElement, {
        layout: {
          background: {
            color: "rgb(22, 26, 30)",
          },
          textColor: "rgb(183, 189, 198)",
        },
        grid: {
          vertLines: { color: "#444" },
          horzLines: { color: "#444" },
        },
      }) as any;
      chart?.applyOptions({
        priceFormat: {
          type: "price",
          precision: 6,
          minMove: 0.000001,
        },
      });
      chartRef.current = renderChart(chart);
    } else if (historicalData.length > 0) {
      const candlestickSeries = chartRef.current as ISeriesApi<
        "Candlestick",
        Time,
        SeriesDataItemTypeMap["Candlestick"],
        SeriesOptionsMap["Candlestick"],
        SeriesPartialOptionsMap["Candlestick"]
      >;
      const formattedData = historicalData.map((item) => ({
        time: (item[0] / 1000) as Time,
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
      }));
      const min = Math.min(...historicalData.map((item) => parseFloat(item[1])));
      const max = Math.max(...historicalData.map((item) => parseFloat(item[1])));
      const range = max - min;

      let precision = 0;
      let minMove = 0;

      if (range !== 0) {
        precision = Math.ceil(Math.log10(1 / range));
        minMove = precision < 0 ? 0.001 : parseFloat((1 / Math.pow(10, precision + 3)).toFixed(precision + 3));
      }
      if (precision > 0) {
        chart?.applyOptions({
          priceFormat: {
            minMove: minMove,
            precision: precision + 3,
          },
        });
      } else {
        chart?.applyOptions({
          priceFormat: {
            minMove: 0.001,
            precision: 3,
          },
        });
      }
      candlestickSeries.setData(formattedData);
    }
  }, [historicalData, renderChart, symbol]);

  useEffect(() => {
    return () => {
      if (chartRef?.current && (chartRef?.current as any).timeScale) {
        (chartRef?.current as any).timeScale().unsubscribeVisibleTimeRangeChange();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className={`${styles.chart_container} ${styles.chart_container_loading}`}>
        <CircularProgress sx={{ color: "#F3BA2F" }} />
      </div>
    );
  }

  return (
    <div
      className={styles.chart_container}
      data-testid='tradingview-chart'
      ref={containerRef}
    />
  );
};

export default CandlestickChart;
