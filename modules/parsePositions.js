const { ethers } = require("ethers");
const { newEntryLimit, sellLimit } = require("../config");
const { processSellCondition } = require("./fetchSellCondition");

const parsePositionsData = async (
  positionsData,
  currentPrice,
  isShort,
  tokenName,
) => {
  const details = [];
  const _sellLimit = sellLimit * 100; // This seems incorrect, as it overly multiplies sellLimit. Should be removed or adjusted to the correct logic.
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  for (let i = 0; i < positionsData.length / 9; i++) {
    const baseIndex = i * 9;
    const sizeInWei = ethers.BigNumber.from(positionsData[baseIndex]);
    const scaleFactor = ethers.BigNumber.from("10").pow(27);
    const formattedSize = sizeInWei.div(scaleFactor);
    const deltaInWei = ethers.BigNumber.from(positionsData[baseIndex + 8]);
    const formattedDelta = deltaInWei.div(scaleFactor);
    const adjustedDelta = Number(formattedDelta.toString()) / 1000;
    const collateralInWei = ethers.BigNumber.from(positionsData[baseIndex + 1]);
    const formattedCollateral = collateralInWei.div(scaleFactor);
    const entryPriceInWei = ethers.BigNumber.from(positionsData[baseIndex + 2]);
    const formattedAveragePrice = entryPriceInWei.div(scaleFactor);
    const adjustedSize = Number(formattedSize.toString()) / 1000;
    const adjustedCollateral = Number(formattedCollateral.toString()) / 1000;
    const adjustedAveragePrice =
      Number(formattedAveragePrice.toString()) / 1000;

    if (adjustedSize === 0) continue;

    const deltaPercentage = (adjustedDelta / adjustedCollateral) * 100;
    const lastIncreasedTime = new Date(
      positionsData[baseIndex + 6] * 1000,
    ).toLocaleString("en-US", { timeZone: "America/Chicago" });

    // Calculate fees
    const openFee = parseFloat((adjustedSize * 0.001).toFixed(2)); // Calculate 0.01% of the size
    const openCloseFees = parseFloat((openFee * 2).toFixed(2)); // Open fee x 2 for open + close

    // Calculate target sell price based on position type
    const targetSellPrice =
      isShort === true
        ? adjustedAveragePrice * (1 - sellLimit) //  entry price * sell limit % change
        : adjustedAveragePrice * (1 + sellLimit); // If long, entry price * sell limit % change

    // Calculate PROFIT POTENTIAL
    const positionProfit = adjustedSize * (1 + sellLimit);
    const ps = positionProfit - adjustedSize;
    const potentialProfit = parseFloat(ps - openCloseFees);

    const tradeParams = {
      entryPrice: adjustedAveragePrice,
      currentPrice: currentPrice,
      isShort: isShort,
      targetSellPrice: targetSellPrice.toFixed(2),
      positionSize: adjustedSize.toFixed(2),
      deltaPercentage: deltaPercentage.toFixed(2),
      collateralDelta: adjustedCollateral.toFixed(2),
      tokenName: tokenName,
      type: isShort ? "short" : "long",
    };

    // fetch trade logic
    await processSellCondition(tradeParams);

    details.push({
      positionIndex: i,
      name: tokenName,
      size: adjustedSize.toFixed(2),
      sizeWei: sizeInWei.toString(),
      collateral: adjustedCollateral.toFixed(2),
      collateralWei: collateralInWei.toString(),
      entryPrice: formatter.format(adjustedAveragePrice),
      currentPrice: currentPrice,
      deltaPercentage: deltaPercentage.toFixed(2) + "%",
      lastIncreasedTime: lastIncreasedTime,
      hasProfit: positionsData[baseIndex + 7].toString(),
      delta: formatter.format(adjustedDelta),
      short: isShort,
      openClose: openCloseFees,
      sellPrice: targetSellPrice.toFixed(2),
      potential: potentialProfit.toFixed(2),
    });
  }
  return details;
};

module.exports = { parsePositionsData };
