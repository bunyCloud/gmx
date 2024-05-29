const express = require("express");
var colors = require("colors");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
//-----------modules--------------//
const { fetchBalances } = require("./fetchBalances");
// config variables
const {
  newEntryLimit,
  sellLimit,
  tokenName,
  lossLimit,
  minAvaxBalance,
} = require("../config");
const { handleCreateDecreaseOrder } = require("../functions/decreaseOrder");

// ETH Trade Simulator
// Fetch ETH price on load.
// Set ETH price as entry price
// check eth price at timed intervals.
// if eth price is greater than entry price by [ 0.7% ] -
// set last sell price and clear entry price.
// wait until price drops at least 0.3% of last sell price
// before setting as the new entryPrice.

const _sellLimit = sellLimit * 100; // sell limit
let lastSellPrice = 0;

// START MONITORING POSITIONS BOT
const fetchTradeLogic = async ({
  entryPrice,
  percentageChange,
  positionSize,
  currentPrice,
  deltaPercentage,
  hasProfit,
  targetBuyPrice,
  targetSellPrice,
  tokenName,
  type,
}) => {
  const { ethBalance } = await fetchBalances();


  //

  let sellCondition = false;
  let balanceCondition = false;
  let buyCondition = false;
  
  // calculations
  
    // DIFFERENCE
    const difference = parseFloat((targetSellPrice - currentPrice).toFixed(1));

  // --------TRADE LOGIC

  // CHECK IF POSITION EXIST / ENTRY PRICE
  if (entryPrice !== null) {
    console.log(`Monitoring ${tokenName} ${type}....`.green);

    console.log(`=================================================`.yellow);
    console.log(
      `Target Sell Price:` + `$${targetSellPrice} ${tokenName}`.yellow,
    );
    console.log(
      `Current Price:` + `$${currentPrice} ${tokenName}`.green,
    );
    console.log(
      `Difference:` + `$${difference}`.green,
    );
    console.log(`=================================================`.yellow);
    console.log(``);
    
    console.log(`Have a nice day !`.bgMagenta);



    // SELL CONDITIONS
    // check if target sell conditions have been met

    // if type = short and current price is equal or less than target sell price conditions are met. 
    // if type = long and current price is equal or greater than target sell price condition are met. 
    if ((type === 'long' && currentPrice >= targetSellPrice) || 
    (type === 'short' && currentPrice <= targetSellPrice)) {
  console.log("Sell conditions met");
  console.log(`Sell conditions met: ${sellCondition}`);

  // Execute the position closing logic
  try {
    // Your logic to close the position goes here
    await handleCreateDecreaseOrder(collateralInWei, decreaseSize);
    console.log("Position closed successfully");
  } catch (error) {
    console.error("Transaction failed:", error);
  }
} else {
  console.log("Sell conditions not met");
  console.log(`Sell conditions met: ${sellCondition}`);
  // Additional logic can be implemented here if needed
}

    // RE-ENTRY CONDITIONS
    // Check if target buy conditions have been met

    if (currentPrice <= lastSellPrice * (1 - 0.003)) {
      console.log("Target Buy conditions met!".green);

      if (ethBalance >= minAvaxBalance) {
        // Trigger Increase Position
        //   await handleIncreaseAvax(usdValue, collateralIn);
      }
    }

    // RE-BALANCE
    // Check for re-balance conditions
    if (deltaPercentage >= lossLimit && hasProfit === 0) {
      // warning delta is equal or greater than -10%
      console.log(
        colors.bgRed(
          `Warning: Negative Delta % is >= ${lossLimit} - ${deltaPercentage}%`,
        ),
      );
      console.log("Rebalance needed...!".red);

      // TEMPORARY

      //const increase = await handleIncreaseAvax(increaseSize,amountIn);
      //console.log(`increase: ${increase}`)
    }
  } else {
    // If no entry price & no target buy price, set new target price.
    // Target buy price = -0.3% of current eth price.

    console.log(`No entry price found....`);
    console.log(`Checking targets....`);
    console.log(`.................................`.yellow);

    // NEW ENTRY
    if (currentPrice <= targetBuyPrice && targetBuyPrice !== null) {
      console.log(
        `Target Buy Price of $${targetBuyPrice} has been reached or exceeded.`,
      );
      console.log(
        `Current price $${currentPrice} is equal of less than Target Price: $${targetBuyPrice}`
          .green,
      );
      console.log(`Initiating Open Position request... `.green);

      // CREATE INCREASE POSITION
      try {
        if (ethBalance >= minAvaxBalance) {
          //handleIncreaseAvax(increaseSize, amountIn);
        } else {
          console.log(`Insufficient balance:  ${ethBalance}/AVAX`.red);
          console.log(`Unable to increase position...`.red);
        }
        // Reset targetBuyPrice after buying or increasing position
        targetBuyPrice = null;
      } catch (error) {
        console.error("Transaction failed:".red, error);
      }
    }

    // BUY/SELL TARGETS
    else if (targetBuyPrice === null || targetBuyPrice === undefined) {
      console.log(`No targets found... `.yellow);
      console.log(`Setting target entry price...`.yellow);
      console.log(`.................................`.yellow);

      // Set TARGET BUY price
      const targetBuy = currentPrice * (1 - newEntryLimit);
      targetBuyPrice = parseFloat(targetBuy.toFixed(2));
      console.log(
        `Target entry price set: $${targetBuyPrice.toFixed(2)}`.yellow,
      );
    } else {
      console.log(`Monitoring Target Price: ${targetBuyPrice}`.green);
    }
  }
};

module.exports = {
  fetchTradeLogic,
};
