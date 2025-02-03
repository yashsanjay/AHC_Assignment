// Placeholder example for calculating cumulative volume over a 60-minute window
const calculateRollingVolume = (stockData) => {
    const rollingVolumes = {};

    Object.keys(stockData).forEach((stock) => {
        const stockEntries = stockData[stock];

        let cumulativeVolume = 0;
        let startIndex = 0;

        stockEntries.forEach((entry, index) => {
            cumulativeVolume += entry.quantity;

            // Remove entries older than 60 minutes (3600 seconds)
            while (
                stockEntries[startIndex] &&
                new Date(entry.timestamp) - new Date(stockEntries[startIndex].timestamp) > 3600000
            ) {
                cumulativeVolume -= stockEntries[startIndex].quantity;
                startIndex++;
            }

            // Store the cumulative volume for this stock at this point in time
            if (!rollingVolumes[stock]) rollingVolumes[stock] = [];
            rollingVolumes[stock].push({ timestamp: entry.timestamp, cumulativeVolume });
        });
    });

    return rollingVolumes;
};

module.exports = { calculateRollingVolume };
