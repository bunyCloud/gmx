// fetchShortPositions.js

// Import the specific short position functions
const { fetchWavaxShort, fetchBtcShort, fetchWethShort } = require('./positionsLoader');

// Function to fetch all short positions together
async function fetchAllShortPositions() {
    try {
        const wavaxShortPosition = await fetchWavaxShort();
        const btcShortPosition = await fetchBtcShort();
        const wethShortPosition = await fetchWethShort();

        return {
            wavaxShortPosition,
            btcShortPosition,
            wethShortPosition
        };
    } catch (error) {
        console.error("Error fetching all short positions:", error);
        throw error; // Rethrow or handle as appropriate
    }
}

// Export the individual functions and the bundled function
module.exports = {
    fetchWavaxShort,
    fetchBtcShort,
    fetchWethShort,
    fetchAllShortPositions
};
