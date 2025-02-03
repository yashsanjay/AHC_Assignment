// Check if cumulative volume crosses the 30-day average
const checkCrossOver = (rollingVolumes, averages, targetDates) => {
    const crossoverTimes = {};

    targetDates.forEach((targetDate) => {
        const dateAverages = averages[targetDate];

        Object.keys(rollingVolumes).forEach((stock) => {
            const stockRollingVolumes = rollingVolumes[stock];
            const stockAverage = dateAverages[stock];

            if (!stockAverage) return;

            let crossoverTimestamp = null;

            // Loop through the rolling volumes and break once the crossover is found
            for (let i = 0; i < stockRollingVolumes.length; i++) {
                const entry = stockRollingVolumes[i];

                if (entry.cumulativeVolume > stockAverage && !crossoverTimestamp) {
                    crossoverTimestamp = entry.timestamp;
                    break;  // Exit the loop once the first crossover is found
                }
            }

            crossoverTimes[stock] = crossoverTimestamp || 'None';
        });
    });

    return crossoverTimes;
};

module.exports = { checkCrossOver };
