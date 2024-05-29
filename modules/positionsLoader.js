// positionsLoader.js

const { fetchPosition } = require('./fetchPosition');
const { wavax, weth, btc, usdc } = require('../config'); // Assuming these are the token addresses
const { handleWavaxPrice } = require('./fetchWavaxPrice');
const { handleWethPrice } = require('./handleWethPrice');
const { handleBtcPrice } = require('./fetchBtcPrice');

/**
 * Fetch WAVAX long positions.
 */
async function fetchWavaxLong() {
  try {
    const collateralTokens = [wavax, usdc];
    const indexTokens = [wavax, wavax];
    const isLong = [true, true];
    const isShort = false;
    const tokenName = 'WAVAX';
    const currentPrice = await handleWavaxPrice();
    const positions = await fetchPosition(collateralTokens, indexTokens, isLong, currentPrice, isShort, tokenName);
    console.log("WAVAX LONG:".green, positions);
    return positions;
  } catch (error) {
    console.error("Failed to fetch WAVAX long positions:", error);
  }
}

/**
 * Fetch WAVAX short positions.
 */
async function fetchWavaxShort() {
  try {
    const collateralTokens = [wavax, usdc];
    const indexTokens = [wavax, wavax];
    const isLong = [false, false];
    const isShort = true;
    const tokenName = 'WAVAX';
    const currentPrice = await handleWavaxPrice();
    const positions = await fetchPosition(collateralTokens, indexTokens, isLong, currentPrice, isShort, tokenName);
    console.log("WAVAX SHORT:".green, positions);
    return positions;
  } catch (error) {
    console.error("Failed to fetch WAVAX short positions:", error);
  }
}

/**
 * Fetch WETH long positions.
 */
async function fetchWethLong() {
  try {
    const collateralTokens = [weth, usdc];
    const indexTokens = [weth, weth];
    const isLong = [true, true];
    const isShort = false;
    const tokenName = 'WETH';
    const currentPrice = await handleWethPrice();
    const positions = await fetchPosition(collateralTokens, indexTokens, isLong, currentPrice, isShort, tokenName);
    console.log("WETH LONG:".green, positions);
    return positions;
  } catch (error) {
    console.error("Failed to fetch WETH long positions:", error);
  }
}

/**
 * Fetch WETH short positions.
 */
async function fetchWethShort() {
  try {
    const collateralTokens = [weth, usdc];
    const indexTokens = [weth, weth];
    const isLong = [false, false];
    const isShort = true;
    const tokenName = 'WETH';
    const currentPrice = await handleWethPrice();
    const positions = await fetchPosition(collateralTokens, indexTokens, isLong, currentPrice, isShort, tokenName);
    console.log("WETH SHORT:".green, positions);
    return positions;
  } catch (error) {
    console.error("Failed to fetch WETH short positions:", error);
  }
}

/**
 * Fetch BTC long positions.
 */
async function fetchBtcLong() {
  try {
    const collateralTokens = [btc, usdc];
    const indexTokens = [btc, btc];
    const isLong = [true, true];
    const isShort = false;
    const tokenName = 'BTC';
    const currentPrice = await handleBtcPrice();
    const positions = await fetchPosition(collateralTokens, indexTokens, isLong, currentPrice, isShort, tokenName);
    console.log("Fetched BTC Long Positions:", positions);
    return positions;
  } catch (error) {
    console.error("Failed to fetch BTC long positions:", error);
  }
}

/**
 * Fetch BTC short positions.
 */
async function fetchBtcShort() {
  try {
    const collateralTokens = [btc, usdc];
    const indexTokens = [btc, btc];
    const isLong = [false, false];
    const isShort = true;
    const tokenName = 'BTC';
    const currentPrice = await handleBtcPrice();
    const positions = await fetchPosition(collateralTokens, indexTokens, isLong, currentPrice, isShort, tokenName);
    console.log("BTC SHORT:".green, positions);
    return positions;
  } catch (error) {
    console.error("Failed to fetch BTC short positions:", error);
  }
}

module.exports = {
  fetchWavaxLong, fetchWavaxShort,
  fetchWethLong, fetchWethShort,
  fetchBtcLong, fetchBtcShort
};
