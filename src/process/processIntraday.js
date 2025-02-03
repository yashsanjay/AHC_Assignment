const fs = require('fs');
const path = require('path');
const { calculate30DayAverage } = require('../utils/calculate30DayAverage');
const { calculateRollingVolume } = require('../utils/calculateRollingVolume');
const { checkCrossOver } = require('../utils/checkCrossover');
const csv = require('csv-parser');

const dayDataPath = path.join(__dirname, '../data/day_data.csv');
const targetDates = ['19/04/24', '22/04/24']; // Target dates for which we need the average

const processIntraday = async () => {
    try {
        // 1. Calculate 30-day average volumes for the target dates
        const averages = await calculate30DayAverage(dayDataPath, targetDates);
        console.log('30-Day Averages:', averages);

        // 2. Process the intraday data for 19th and 22nd April
        const intradayData = [
            path.join(__dirname, '../data/intraday_2024-04-19.csv'),
            path.join(__dirname, '../data/intraday_2024-04-22.csv'),
        ];

        intradayData.forEach((filePath) => {
            const stockData = {};

            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    const stockName = row['Stock Name'];
                    const date = row['Date'];
                    const time = row['Time'];
                    const quantity = Number(row['Last Traded Quantity']);

                    if (!stockData[stockName]) {
                        stockData[stockName] = [];
                    }

                    // Format the timestamp as a single string to track by
                    const timestamp = `${date} ${time}`;
                    stockData[stockName].push({ timestamp, quantity });
                })
                .on('end', () => {
                    // 3. Calculate the rolling volume and check for crossover
                    const rollingVolumes = calculateRollingVolume(stockData);
                    // console.log(rollingVolumes);
                    
                    const crossoverTimes = checkCrossOver(rollingVolumes, averages, targetDates);
                    console.log(`Crossover Times for ${filePath}:`, crossoverTimes);
                });
        });
    } catch (error) {
        console.error('Error processing intraday data:', error);
    }
};

module.exports = { processIntraday };
