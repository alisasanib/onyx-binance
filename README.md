# Onyx Frontend task

This is the take Home Test for Onyx capital group showcasing an online trades list by connecting to Binance websocket and rest endpoints. It also displays the price chart and provides an option for the user to switch between different coin pairs. It automatically update the trades list and chart values. In addition to live data, the chart also handles historical data if you drag to the left. The project is deployed to [https://onyx-binance.vercel.app](https://onyx-binance.vercel.app) by vercel. Tests have also added for three components that we have: Trades, Chart, CoinPairSearch. The project supports responsiveness and adjust components on different devices.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### `npm run test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `dist` folder.

## Further improvements

- Supporting more functionalities in the chart such as switching between different types of charts, changing time frames, measuring values etc, making chart full-screen.

- Reflecting selected coin pair in the url and create a 404 page to serve unknown coin pairs/urls.

- Improve the styling, UI/UX, and responsiveness, and error handling
