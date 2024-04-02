export type BinanceMessage = {
  E: number;
  e: string;
  k: {
    B: string;
    L: number;
    Q: string;
    T: number;
    V: string;
    c: string;
    f: number;
    h: string;
    i: string;
    l: string;
    n: number;
    o: string;
    q: string;
    s: string;
    t: number;
    v: string;
    x: boolean;
  };
  s: string;
};

export type Pair = {
  askPrice: string;
  askQty: string;
  bidPrice: string;
  bidQty: string;
  closeTime: number;
  count: number;
  firstId: number;
  highPrice: string;
  lastId: number;
  lastPrice: string;
  lastQty: string;
  lowPrice: string;
  openPrice: string;
  openTime: number;
  prevClosePrice: string;
  priceChange: string;
  priceChangePercent: string;
  quoteVolume: string;
  symbol: string;
  volume: string;
  weightedAvgPrice: string;
};

export type Trade = {
  id: number;
  isBestMatch: boolean;
  isBuyerMaker: boolean;
  price: string;
  qty: string;
  quoteQty: string;
  time: number | string;
};

export type HistoricalDataType = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string,
  string
];
