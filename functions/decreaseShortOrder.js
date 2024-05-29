const express = require("express");
const ethers = require("ethers");
const app = express();
const cors = require("cors");
const OrderBook = require("../contracts/OrderBook.json");
const {
  minOut,
  accountAddress,
  wallet,
  wavax,
  usdc,
} = require("../config");
const { calculateSize } = require("../modules/calculateSizeModule");

require("dotenv").config();
app.use(express.json());
app.use(cors());
const nativeTokenAddress = ethers.constants.AddressZero;
const collateralToken = [usdc];
const indextoken = wavax;
const isLong = true;

const executionFee = "10000100000000000";


async function handleDecreaseShortOrder(
  decreaseSize,
  targetSellPrice,
) {
  
// Format increase size

// Check weth balance, check avax balance before submitting. 

  try {
    console.log("starting decrease transaction...");
    console.log(`Decrease size: ${decreaseSize}`);
    console.log(`Amount In: ${collateralIn}`);

    const contract = new ethers.Contract(
      OrderBook.address,
      OrderBook.abi,
      wallet,
    );
    


    //const gasLimit = ethers.BigNumber.from("600000");
    const amountIn = '0';
    const positionSize = decreaseSize;
    const target = calculateSize(targetSellPrice);
    console.log(target)
    
    const tx = await contract.createDecreaseOrder(
      collateralToken,
      
      amountIn,
      indextoken,
      decreaseSize,
      positionSize,
      isLong,
      
      target,
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
      `Close order submitted successfully: ${receipt.transactionHash}`,
    );

    

  

    
  } catch (error) {
    console.error("Error closing position", error);
    throw error;
  }
}


// Export the functions
module.exports = {
  handleDecreaseShortOrder
};

//3425.86