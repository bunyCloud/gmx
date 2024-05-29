// fetchLongPositions.js

// Import the specific long position functions from the positionsLoader module
const { fetchWavaxLong, fetchBtcLong, fetchWethLong } = require('./positionsLoader');

// Optionally create a function that bundles these calls if needed
async function fetchAllLongPositions() {
    try {
        const wavaxLongPositions = await fetchWavaxLong();
        const btcLongPositions = await fetchBtcLong();
        const wethLongPositions = await fetchWethLong();

        return {
            wavaxLongPositions,
            btcLongPositions,
            wethLongPositions
        };
    } catch (error) {
        console.error("Error fetching all long positions:", error);
        throw error; // Rethrow or handle as appropriate
    }
}

// Export the individual functions and the bundled function
module.exports = {
    fetchWavaxLong,
    fetchBtcLong,
    fetchWethLong,
    fetchAllLongPositions
};
