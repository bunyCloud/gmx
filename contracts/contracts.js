const { ethers } = require("ethers");

const AVALANCHE = 43114; // Assuming this is defined elsewhere or provided as a constant

const CONTRACTS_AVALANCHE = {
  Vault: "0x9ab2De34A33fB459b538c43f251eB825645e8595",
  Router: "0x5F719c2F1095F7B9fc68a68e35B51194f4b6abe8",
  VaultReader: "0x66eC8fc33A26feAEAe156afA3Cb46923651F6f0D",
  Reader: "0x2eFEE1950ededC65De687b40Fd30a7B5f4544aBd",
  GlpManager: "0xD152c7F25db7F4B95b7658323c5F33d176818EE4",
  RewardRouter: "0x82147C5A7E850eA4E28155DF107F2590fD4ba327",
  GlpRewardRouter: "0xB70B91CE0771d3f4c81D87660f71Da31d48eB3B3",
  RewardReader: "0x04Fc11Bd28763872d143637a7c768bD96E44c1b6",
  NATIVE_TOKEN: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
  GLP: "0x01234181085565ed162a948b6a5e88758CD7c7b8",
  GMX: "0x62edc0692BD897D2295872a9FFCac5425011c661",
  ES_GMX: "0xFf1489227BbAAC61a9209A08929E4c87eF8d8F17",
  BN_GMX: "0x8087a341D32D445d9aC8aCc9c14F5781E04A26d2",
  USDG: "0xc0253c3cC6aa5Ab407b5795a04c28fB063273894",
  ES_GMX_IOU: "0x6260101218eC4cCfFF1b778936C6f2400f95A954", // Placeholder address
  // Add other contracts as needed
};

function getContractAvalanche(name) {
  if (!CONTRACTS_AVALANCHE[name]) {
    throw new Error(`Unknown contract "${name}" for Avalanche`);
  }

  return CONTRACTS_AVALANCHE[name];
}

module.exports = {
  getContractAvalanche,
};
