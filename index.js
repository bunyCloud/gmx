const express = require("express");

const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const WebSocket = require("ws");
const colors = require("colors");
const figlet = require("figlet");
const log = console.log;
const buny = require("./buny.json");
const introPrinter = require("./intro");
const {
  PORT,
  accountAddress,
  providerUrl,
  timeDelay,
  ...config
} = require("./config");
const { fetchAccountData } = require("./modules/fetchAccountData");
const { fetchAllPositions } = require("./modules/fetchAllPositions");
const { handleBtcPrice } = require("./modules/fetchBtcPrice");
const { handleWavaxPrice } = require("./modules/fetchWavaxPrice");
const { handleWethPrice } = require("./modules/handleWethPrice");
const { handleCreateDecreaseOrder } = require("./functions/decreaseOrder"); // Make sure this is correctly imported
const { closeAvaxLong } = require("./functions/closeAvaxLong");
const {
  fetchTokenApi,
  fetchWavaxPrice,
  fetchWethPrice,
  fetchUsdcPrice,
  fetchBtcPrice,
} = require("./modules/fetchTokenApi");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));

async function displayTokenPrices() {
  try {
    const wavaxPrice = await fetchWavaxPrice();
    const wethPrice = await fetchWethPrice();
    const usdcPrice = await fetchUsdcPrice();
    const btcPrice = await fetchBtcPrice();

    console.log(`WAVAX Price: ${wavaxPrice}`);
    console.log(`WETH Price: ${wethPrice}`);
    console.log(`USDC Price: ${usdcPrice}`);
    console.log(`BTC Price: ${btcPrice}`);
  } catch (error) {
    console.error("Error fetching token prices:", error);
  }
}

const server = app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(colors.bgWhite(`Loading Account #0....`));
  console.log(`Connected to account: ${accountAddress}`);
  console.log(`Provider: ${providerUrl}`);
  log(colors.yellow(figlet.textSync(buny.name, { horizontalLayout: "full" })));
  displayTokenPrices();
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");
  const clientId = uuidv4();
  console.log(`Client connected with ID: ${clientId}`);
  ws.send(JSON.stringify({ type: "clientId", id: clientId }));

  const introData = introPrinter.PrintIntro();
  ws.send(JSON.stringify({ type: "intro", data: introData }));

  ws.on("message", async function incoming(message) {
    console.log("Received message:", message);
    try {
      const data = JSON.parse(message);

      // Handle createDecreaseOrder
      if (data.type === "createDecreaseOrder") {
        const {
          indexToken,
          sizeDelta,
          collateralToken,
          collateralDelta,
          isLong,
          triggerPrice,
          triggerAboveThreshold,
        } = data;
        const response = await handleCreateDecreaseOrder(
          indexToken,
          sizeDelta,
          collateralToken,
          collateralDelta,
          isLong,
          triggerPrice,
          triggerAboveThreshold,
        );
        ws.send(
          JSON.stringify({
            type: "response",
            status: "success",
            data: response,
          }),
        );
      }

      // Handle closeAvaxLong
      else if (data.type === "closeAvaxLong") {
        const { collateralIn, decreaseSize } = data;
        const response = await closeAvaxLong(collateralIn, decreaseSize);
        ws.send(
          JSON.stringify({
            type: "response",
            status: "success",
            data: response,
          }),
        );
      } else if (data.type === "updateConfig") {
        // Update configuration settings
        Object.keys(data.config).forEach((key) => {
          if (config.hasOwnProperty(key)) {
            config[key] = data.config[key];
            console.log(`Config updated: ${key} set to ${config[key]}`);
          }
        });
        ws.send(
          JSON.stringify({
            type: "configUpdated",
            success: true,
            config: config,
          }),
        );
      } else {
        throw new Error("Unknown type");
      }
    } catch (error) {
      console.error("Error processing request:", error);
      ws.send(
        JSON.stringify({
          type: "response",
          status: "error",
          message: error.toString(),
        }),
      );
    }
  });

  sendData(ws); // Send initial data

  const intervalId = setInterval(() => {
    sendData(ws);
  }, timeDelay);

  ws.on("close", () => {
    console.log("WebSocket connection closed.");
    clearInterval(intervalId);
  });
});

async function sendData(ws) {
  try {
    const accountData = await fetchAccountData();
    const avaxPrice = await handleWavaxPrice();
    const wethPrice = await handleWethPrice();
    const btcPrice = await handleBtcPrice();
    const allPositions = await fetchAllPositions();

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "accountData", data: accountData }));
      ws.send(
        JSON.stringify({ type: "avaxPrice", price: avaxPrice.toFixed(2) }),
      );
      ws.send(
        JSON.stringify({ type: "wethPrice", price: wethPrice.toFixed(2) }),
      );
      ws.send(JSON.stringify({ type: "btcPrice", price: btcPrice.toFixed(2) }));
      ws.send(JSON.stringify({ type: "allPositions", data: allPositions }));
      ws.send(JSON.stringify({ type: "config", config: config }));
    }
  } catch (error) {
    console.error("Failed to fetch or send data:", error);
    ws.send(JSON.stringify({ type: "error", message: "Failed to fetch data" }));
  }
}
