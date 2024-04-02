import { render } from "@testing-library/react";
import Chart from "./";
import * as X from "../../websocket";

jest.mock("../../websocket", () => ({
  binanceStream: {
    send: jest.fn(),
    onMessage: jest.fn(),
    onOpen: jest.fn(),
    connected: true,
  },
}));

describe("<Chart />", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => {
      return Promise.resolve({
        json: () => Promise.resolve({ data: {} }),
      });
    }) as jest.Mock;
  });
  test("should rerender component, unsubscribe previous pair and subscribe to new pair successfully", async () => {
    const { rerender } = render(<Chart symbol={"BTCUSDT"} />);

    expect(X.binanceStream.send).toHaveBeenCalledWith({ id: 1, method: "SUBSCRIBE", params: ["btcusdt@kline_1h"] });
    expect(global.fetch).toHaveBeenCalledWith("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d");

    rerender(<Chart symbol={"BNBBTC"} />);

    expect(global.fetch).toHaveBeenCalledWith("https://api.binance.com/api/v3/klines?symbol=BNBBTC&interval=1d");
    expect(X.binanceStream.send).toHaveBeenCalledWith({ id: 1, method: "UNSUBSCRIBE", params: ["btcusdt@kline_1h"] });
    expect(X.binanceStream.send).toHaveBeenCalledWith({ id: 1, method: "SUBSCRIBE", params: ["bnbbtc@kline_1h"] });
  });
  test("should render chart element properly", async () => {
    const wrapper = render(<Chart symbol={"BTCUSDT"} />);

    expect(X.binanceStream.send).toHaveBeenCalledWith({ id: 1, method: "SUBSCRIBE", params: ["btcusdt@kline_1h"] });
    expect(global.fetch).toHaveBeenCalledWith("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d");

    const chart = await wrapper.findByTestId("tradingview-chart");

    expect(chart).not.toBeNull();
  });
});
