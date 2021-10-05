const superagent = require('superagent');
const fs = require('fs');

// Actions
// 1. Get latest information from the public API (last 7 days, include today)
// 2. Add the data to my private dataset.
// 2a. NEW information will be added immediately.
// 2b. OLD information will not be added.
// 2c. UDPATED information will be updated in the DB.

module.exports = async function () {
  try {
    ////////////////////////////////////////////
    // Determine start date of query

    const today = new Date();
    const weekday = today.getDay();
    const hour = today.getHours();

    // Determine earliest valid data date.
    // Objective is to maintain 7 days-worth of valid date in DB. VDH only updates their DB by noon every weekday. If this query is run on a weekend or before noon on Monday, potentially 3 days of data will be empty. Thus, we must determine collect data from days that actually have data. We must therefore determine what the start date of the data collection must be based on the time of the query.

    let dayModulator = 7; // Baseline of 6 days. Calculating start date with 6 will calculate the earliest data date to be 6 days from today, meaning today's results will be included in the query.

    // Modulate the start date based on the day of the week. The number of days traversed backwards is adjusted relative to Friday, the last valid data day of the week. 6 = Saturday, 0 = Sunday, 1 = Monday.
    dayModulator +=
      weekday === 6
        ? 1
        : weekday === 0
        ? 2
        : weekday === 1 && hour < 12
        ? 2
        : 0;

    // VDH updates data source by noon. If this query is run before noon, the dayModulator is adjust to not include today's date in the results.
    dayModulator += today.getHours() >= 12 ? 0 : 1;

    const startDate = new Date(
      today.getTime() -
        dayModulator * 24 * 60 * 60 * 1000 -
        process.env.TIMEZONE_OFFSET * 60 * 60 * 1000
    );

    ////////////////////////////////////////////
    // Generate API URL
    const APIURL = process.env.DATA_SOURCE_STRING.replace(
      '{%DATE%}',
      startDate.toISOString().replace('Z', '')
    );
    console.log(`Search URL is: `, APIURL);

    ////////////////////////////////////////////
    // Fetch query results
    const results = await superagent.get(APIURL);

    if (process.env.NODE_ENV === 'development') {
      await fs.promises.writeFile(
        process.env.DEBUG_DATA_PATH,
        JSON.stringify(results.body)
      );
    }

    return results.body;
  } catch (error) {
    throw error;
  }
};
