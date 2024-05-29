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

const { calculateSize } = require("../modules/calculateSizeModule");
const { handleDynamicPrice } = require("../modules/dynamicFetchPrice");

require("dotenv").config();
app.use(express.json());
app.use(cors());
const nativeTokenAddress = ethers.constants.AddressZero;


const collateralToken = [usdc];

async function handleClosePosition(
  indexToken,
  sizeDelta,
  amountIn,
  isLong,
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
const _amountIn = amountIn;
// position size
const positionSize = sizeDelta;

    // sell price
    const acceptablePrice = await handleDynamicPrice(indexToken);

    // contract call
    const tx = await contract.createDecreasePosition(
      // pass in props
      collateralToken,
      indexToken,
      // amount in
      _amountIn,
      //decrease size
      positionSize,
      isLong,
      // 
      accountAddress,
      acceptablePrice,
      minOut,
      executionFee,
      false,
      nativeTokenAddress,
      {
        gasLimit: ethers.BigNumber.from(550000),
        value: executionFee
      }
    );
    const receipt = await tx.wait();
    console.log(
      `Close position submitted successfully: ${receipt.transactionHash}`,
    );

    
    
  } catch (error) {
    console.error("Error closing position", error);
    throw error;
  }
}


// Export the functions
module.exports = {
  handleClosePosition
};

//3425.86