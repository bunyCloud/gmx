const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const { fetchBalances } = require("./fetchBalances");
const {
  newEntryLimit,
  sellLimit,
  tokenName,
  lossLimit,
  minAvaxBalance,
  usdc,
} = require("../config");
const { handleCreateDecreaseOrder } = require("../functions/decreaseOrder");


let sellCondition = false;

const tokenAddresses = {
  WAVAX: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
  WETH: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
  USDC: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c35b8e", // Correct address if necessary
  BTC: "0x152b9d0FdC40C096757F570A51E494bd4b943E50",
};

const processSellCondition = async ({
  positionSize,
  currentPrice,
  collateralDelta,
  targetSellPrice,
  tokenName,
  type,
}) => {
  const indexToken = tokenAddresses[tokenName.toUpperCase()];
  const collateralToken = usdc;
  const isLong = type === "long";
  const triggerPrice = targetSellPrice;
  const triggerAboveThreshold = false;

  const sellCondition =
    (type === "long" && currentPrice >= triggerPrice) ||
    (type === "short" && currentPrice <= triggerPrice);
    console.log(`=================================================`.yellow);
    console.log(`${tokenName} ${type} `);
    console.log(`=================================================`.yellow);
    console.log(`Checking sell conditions...}`.green);
    console.log(`Ready: ${sellCondition}`);
    console.log(`Is Long: ${isLong}`);
    
    console.log(`index token: ${indexToken}`);
    console.log(`Position Size: ${positionSize}`);
    console.log(`Collateral ${collateralDelta}`);
    console.log(`Collateral Token: ${collateralToken}`);
    console.log(`Current Price: ${currentPrice}`);
    console.log(`trigger price: ${triggerPrice}`);
    console.log(`Trigger above: ${triggerAboveThreshold}`);
    console.log(`=================================================`.yellow);
  
  
  
    if (sellCondition) {
    console.log(`${tokenName} ${type} conditions met, executing trade logic.`);
    
    try {
      /**await handleCreateDecreaseOrder(
        indexToken,
        positionSize,
        collateralToken,
        collateralDelta,
        isLong,
        triggerPrice,
        triggerAboveThreshold
      ); */
      console.log(`Decrease order submitted successfully for ${tokenName}.`);
    } catch (error) {
      console.error("Error executing decrease order for ${tokenName}:", error);
    }
  } else {
    console.log(`${tokenName} ${type} conditions not met, no action taken.`);
  }
  console.log(`=================================================`.yellow);
};

module.exports = {
  processSellCondition,
};
