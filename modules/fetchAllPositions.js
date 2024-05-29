// fetchShortPositions.js

// Import the specific short position functions
const { fetchWavaxShort, fetchBtcShort, fetchWethShort, fetchWavaxLong, fetchWethLong, fetchBtcLong } = require('./positionsLoader');

// Function to fetch all short positions together
async function fetchAllPositions() {
    try {
        const wavaxShortPosition = await fetchWavaxShort();
        const wavaxLongPosition = await fetchWavaxLong();
        //btc
        const btcShortPosition = await fetchBtcShort();
        const btcLongPosition = await fetchBtcLong();
        //weth
        const wethShortPosition = await fetchWethLong();
        const wethLongPosition = await fetchWethShort();

        return {
            wavaxShortPosition,
            wavaxLongPosition,
            btcShortPosition,
            btcLongPosition,
            wethShortPosition,
            wethLongPosition
        };
    } catch (error) {
        console.error("Error fetching all short positions:", error);
        throw error; // Rethrow or handle as appropriate
    }
}

// Export the individual functions and the bundled function
module.exports = {
    fetchWavaxShort,
    fetchWavaxLong,
    fetchBtcShort,
    fetchBtcLong,
    fetchWethShort,
    fetchWethLong,
    fetchAllPositions
};
