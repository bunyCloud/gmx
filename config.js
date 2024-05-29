require("dotenv").config();
const ethers = require("ethers");


// Server port
exports.PORT = 2021;


// ACCOUNT
exports.accountAddress = '0xBbE028eFf077cE1C2a8E635a38946aA80994eB87';
/// mnemonic
const mnemonic = process.env.MNEMONIC;


// SETTINGS
// positive % increase limit before closing position
exports.sellLimit = 0.010;
// If delta equals negative {buyLimit} 
exports.lossLimit = 5;
// negative % decrease before re-entry
exports.newEntryLimit = 0.0025;
// leverage
exports.leverage = 10;
// increase size 
exports.increaseSize = 200; // $500
// position decrease size
exports.decreaseSize = 200; // or change to 100%
// min. position size
exports.minSize = 2000; // $3000
// Update Positions Timer
exports.timeDelay = 10000; // 30 seconds
// Cool down - time delay in seconds after each transaction
exports.cooldownPeriod = 120000; // 120 seconds 


// BALANCE THRESHOLD 
// min AVAX balance
exports.minAvaxBalance = 0.2;
// min WETH balance
exports.minWethBalance = 0;
// min USDC balance
exports.minUsdcBalance = 0;
// min BTC.b balance
exports.minBtcBalance = 0;






///// DO NOT CHANGE
// TOKENS
// wavax
exports.wavax = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
// WETH
exports.weth = '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB';
// USDC
exports.usdc = '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E';
// BTC.b
exports.btc = '0x152b9d0FdC40C096757F570A51E494bd4b943E50';
// Vault Address
exports.vaultAddress = "0x9ab2De34A33fB459b538c43f251eB825645e8595";
// Avalanche mainnet RPC url
exports.providerUrl = 'https://api.avax.network/ext/bc/C/rpc';
// provider
exports.provider = new ethers.providers.JsonRpcProvider(
    exports.providerUrl,
  );

  // wallet
exports.wallet = ethers.Wallet.fromMnemonic(mnemonic).connect(exports.provider);


// Execution fee in wei
exports.executionFee = "20000000000000000";  // DO NOT CHANGE
// execution fee
exports.executionFeeInEther = "0.02";  // DO NOT CHANGE
// min out
exports.minOut = 0;  // DO NOT CHANGE