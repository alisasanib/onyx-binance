import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import Trades from "./";
import * as X from "../../websocket";

jest.mock("../../websocket", () => ({
  binanceStream: {
    send: jest.fn(),
    onMessage: jest.fn(),
    onOpen: jest.fn(),
    connected: true,
  },
}));

describe("<Trades />", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => {
      return Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              id: "1",
              isBestMatch: true,
              isBuyerMaker: false,
              price: "10",
              qty: "12",
              quoteQty: "120",
              time: 1712054833629,
            },
          ]),
      });
    }) as jest.Mock;
  });
  test("should rerender component, unsubscribe previous pair and subscribe to new pair successfully", async () => {
    const { rerender } = render(<Trades symbol={"BTCUSDT"} />);

    expect(X.binanceStream.send).toHaveBeenCalledWith({ id: 1, method: "SUBSCRIBE", params: ["btcusdt@trade"] });
    expect(global.fetch).toHaveBeenCalledWith("https://api.binance.com/api/v3/trades?symbol=BTCUSDT&limit=30");

    rerender(<Trades symbol={"BNBBTC"} />);

    expect(global.fetch).toHaveBeenCalledWith("https://api.binance.com/api/v3/trades?symbol=BNBBTC&limit=30");
    expect(X.binanceStream.send).toHaveBeenCalledWith({ id: 1, method: "UNSUBSCRIBE", params: ["btcusdt@trade"] });
    expect(X.binanceStream.send).toHaveBeenCalledWith({ id: 1, method: "SUBSCRIBE", params: ["bnbbtc@trade"] });
  });
  test("should render correct data", async () => {
    const wrapper = render(<Trades symbol={"BTCUSDT"} />);
    const rows = await wrapper.findAllByTestId("trade-row");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent("10");
    expect(rows[0]).toHaveTextContent("12");
    expect(rows[0]).toHaveTextContent("11:47:13");
  });
});
