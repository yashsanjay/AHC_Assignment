const calculateRollingVolume = (stockData, averages, targetDates) => {
    const crossoverTimes = {};

    targetDates.forEach((targetDate) => {
        const dateAverages = averages[targetDate];

        Object.keys(stockData).forEach((stock) => {
            const stockEntries = stockData[stock]; 
            const stockAverage = dateAverages[stock];

            if (!stockAverage) return;

            let cumulativeVolume = 0;
            let startIndex = 0;
            let crossoverTimestamp = null;

            for (let i = 0; i < stockEntries.length; i++) {
                const entry = stockEntries[i];
                cumulativeVolume += entry.quantity;

                // Remove entries older than 60 minutes
                while (
                    stockEntries[startIndex] &&
                    new Date(entry.timestamp) - new Date(stockEntries[startIndex].timestamp) > 3600000
                ) {
                    cumulativeVolume -= stockEntries[startIndex].quantity;
                    startIndex++;
                }

                // Stop as soon as we find the first crossover
                if (cumulativeVolume > stockAverage) {
                    crossoverTimestamp = entry.timestamp;
                    break;
                }
            }

            crossoverTimes[stock] = crossoverTimestamp || 'None';
        });
    });

    return crossoverTimes;
};

module.exports = { calculateRollingVolume };
