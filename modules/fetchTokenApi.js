const axios = require('axios');

// API URL
const url = 'https://gmx-avax-server.uc.r.appspot.com/prices';

// Token addresses
const addresses = {
    wavax: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    weth: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
    usdc: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    btc: "0x152b9d0FdC40C096757F570A51E494bd4b943E50"
};

// Function to fetch and map token prices
async function fetchTokenPrices() {
    try {
        const response = await axios.get(url);
        const data = response.data;

        // Map data to token addresses
        const prices = {
            wavaxPrice: data[addresses.wavax],
            wethPrice: data[addresses.weth],
            usdcPrice: data[addresses.usdc],
            btcPrice: data[addresses.btc]
        };

        return prices;
    } catch (error) {
        console.error('Failed to fetch token data:', error);
        throw error;  // Proper error handling
    }
}

module.exports = {
    fetchTokenPrices,
    // Export individually if necessary
    fetchWavaxPrice: async () => (await fetchTokenPrices()).wavaxPrice,
    fetchWethPrice: async () => (await fetchTokenPrices()).wethPrice,
    fetchUsdcPrice: async () => (await fetchTokenPrices()).usdcPrice,
    fetchBtcPrice: async () => (await fetchTokenPrices()).btcPrice
};
