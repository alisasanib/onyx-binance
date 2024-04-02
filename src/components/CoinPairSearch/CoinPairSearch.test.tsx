import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import CoinPairSearch from "./";

describe("<CoinPairSearch />", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => {
      return Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              askPrice: "0.05056000",
              askQty: "32.64460000",
              bidPrice: "0.05055000",
              bidQty: "30.66120000",
              closeTime: 1712062174858,
              count: 141543,
              firstId: 439024347,
              highPrice: "0.05099000",
              lastId: 439165889,
              lastPrice: "0.05056000",
              lastQty: "0.07400000",
              lowPrice: "0.04985000",
              openPrice: "0.05097000",
              openTime: 1711975774858,
              prevClosePrice: "0.05096000",
              priceChange: "-0.00041000",
              priceChangePercent: "-0.804",
              quoteVolume: "2604.78201811",
              symbol: "ETHBTC",
              volume: "51718.60990000",
              weightedAvgPrice: "0.05036450",
            },
            {
              askPrice: "0.00848800",
              askQty: "0.49100000",
              bidPrice: "0.00848700",
              bidQty: "4.72300000",
              closeTime: 1712062176183,
              count: 113571,
              firstId: 238206273,
              highPrice: "0.00849900",
              lastId: 238319843,
              lastPrice: "0.00848800",
              lastQty: "0.10800000",
              lowPrice: "0.00825100",
              openPrice: "0.00842600",
              openTime: 1711975776183,
              prevClosePrice: "0.00842500",
              priceChange: "0.00006200",
              priceChangePercent: "0.736",
              quoteVolume: "480.47167556",
              symbol: "BNBBTC",
              volume: "57305.06600000",
              weightedAvgPrice: "0.00838445",
            },
          ]),
      });
    }) as jest.Mock;
  });
  test("should rerender component, unsubscribe previous pair and subscribe to new pair successfully", async () => {
    const wrapper = render(<CoinPairSearch onSelectSymbol={() => {}} />);

    expect(global.fetch).toHaveBeenCalledWith("https://api.binance.com/api/v3/ticker/24hr");

    const pairs = await wrapper.findAllByTestId("coinpair-row");
    const input = wrapper.getByTestId("coinpair-search").querySelector("input");

    expect(pairs).toHaveLength(2);

    fireEvent.change(input as any, { target: { value: "BNB" } });
    const filteredPairs = await wrapper.findAllByTestId("coinpair-row");
    expect(filteredPairs).toHaveLength(1);
  });
});
