const express = require("express");
const ethers = require("ethers");
const app = express();
const cors = require("cors");
const PositionRouter = require("../contracts/PositionRouter.json");
const {
  wavax,
  executionFee,
  minOut,
  tokenName,
  accountAddress,
  wallet,
  minAvaxBalance,
  usdc,
} = require("../config");

const { handleWavaxPrice } = require("../modules/fetchWavaxPrice");
const { calculateSize } = require("../modules/calculateSizeModule");
const { handleFetchPrice } = require("../modules/fetchPrice");
const { handleFetchRawPrice } = require("../modules/fetchPriceRaw");
const { handleAcceptablePrice } = require("../modules/fetchAcceptablePrice");
const { fetchWavaxPrice } = require("../modules/fetchTokenApi");
//const { fetchWavaxPrice } = require("../modules/fetchTokenApi");
//const { handleDynamicPrice } = require("../modules/dynamicFetchPrice");

require("dotenv").config();
app.use(express.json());
app.use(cors());
let lastSellPrice = '';
const nativeTokenAddress = ethers.constants.AddressZero;
const collateral = [usdc];
const indextoken = wavax;
const isLong = true;



async function closeAvaxLong(
  collateralIn,
  decreaseSize,
) {
  
// Format increase size

// Check wavax balance, check avax balance before submitting. 

  try {

    console.log("starting decrease transaction...");

    const contract = new ethers.Contract(
      PositionRouter.address,
      PositionRouter.abi,
      wallet,
    );

    // collateral in  
    const amountIn = collateralIn;
    // position size
    const positionSize = decreaseSize;

    const formatAmount = calculateSize(amountIn)
    const formatSize = calculateSize(positionSize);
    // sell price

    
    //const acceptablePrice = await handleAcceptablePrice();
  
    const wavaxPrice = await fetchMaxPrice(wavax);
    console.log(`WAVAX price: ${wavaxPrice}`);

    // contract call
    const tx = await contract.createDecreasePosition(
      collateral,
      indextoken,
      formatAmount,
      formatSize,
      isLong,
      accountAddress,
      wavaxPrice,
      minOut,
      executionFee,
      false,
      nativeTokenAddress,
      {
        
        value: executionFee
      }
    );
    const receipt = await tx.wait();
    console.log(
      `Close position submitted successfully: ${receipt.transactionHash}`,
    );

    // set approx. sold price.
    lastSellPrice = acceptablePrice;
    console.log(`Sold price: ${lastSellPrice}`);

    
  } catch (error) {
    console.error("Error closing position", error);
    throw error;
  }
}


// Export the functions
module.exports = {
  closeAvaxLong
};

//3425.86