const fs = require('fs');
const csv = require('csv-parser');

/**
 * Calculate the 30-day average volume for each stock.
 * @param {string} dayDataPath - The path to the day data CSV file.
 * @param {array} targetDates - The target dates for which to calculate the average.
 * @returns {Promise<object>} - A promise that resolves with an object containing the 30-day average volumes.
 */
const calculate30DayAverage = (dayDataPath, targetDates) => {
    return new Promise((resolve, reject) => {
        const stockVolumes = {}; // { stock_name: [volumes] }
        const averages = {};

        fs.createReadStream(dayDataPath)
            .pipe(csv())
            .on('data', (row) => {
                const date = row['Date'].trim();
                const stock = row['Stock Name'].trim();
                const volume = Number(row['Volume']);

                if (!stockVolumes[stock]) stockVolumes[stock] = [];
                stockVolumes[stock].push({ date, volume });
            })
            .on('end', () => {
                targetDates.forEach((targetDate) => {
                    const stockAvg = {};
                    Object.keys(stockVolumes).forEach((stock) => {
                        // Filter last 30 trading days
                        const pastVolumes = stockVolumes[stock]
                            .filter((entry) => entry.date < targetDate)
                            .slice(-30)
                            .map((entry) => entry.volume);

                        const avgVolume = pastVolumes.length
                            ? pastVolumes.reduce((a, b) => a + b, 0) / pastVolumes.length
                            : 0;

                        stockAvg[stock] = avgVolume;
                    });
                    averages[targetDate] = stockAvg;
                });

                resolve(averages);
            })
            .on('error', (err) => reject(err));
    });
};

module.exports = { calculate30DayAverage };
