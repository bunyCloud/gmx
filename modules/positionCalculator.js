// positionCalculator.js

/**
 * Calculates financial metrics based on position data.
 * @param {Object} position - The position data including size, currentPrice, and averagePrice.
 * @returns {Object} Calculated metrics including fees, entryPrice, difference, total tokens, and total profit.
 */
function calculatePositionMetrics(position, currentPrice) {
    const size = parseFloat(position.size);
    //const currentPrice = parseFloat(position.currentPrice);

    // Calculate fees
    const openFee = parseFloat((size * 0.001).toFixed(2));  // Calculate 0.01% of the size
    const openCloseFees = parseFloat((openFee * 2).toFixed(2));  // Open fee x 2 for open + close

    // Calculate entry price
    const entryPrice = parseFloat(position.averagePrice.replace(/[^0-9.-]+/g, ""));

    // Calculate difference
    const difference = parseFloat((currentPrice - entryPrice).toFixed(1));

    // Calculate total tokens
    const tItems = parseFloat((size / currentPrice).toFixed(1));

    // Calculate total profit
    const tProfit = parseFloat((tItems * difference).toFixed(2));

    return {
        openFee,
        openCloseFees,
        entryPrice,
        difference,
        tItems,
        tProfit
    };
}

module.exports = {calculatePositionMetrics};
