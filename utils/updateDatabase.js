////////////////////////////////////////////
// TODO: Add JSDOC Comments
// TODO: Make error handling uniform

////////////////////////////////////////////
// MODULES
const fs = require('fs');
const superagent = require('superagent');
const Report = require('./../models/reportModel');

const LogFile = require('../utils/logFile.js');
const log = new LogFile();

////////////////////////////////////////////
// EXPORTS
module.exports = async function () {
  try {
    let dataDump = false;

    await log.init();

    const [internalUpdateDate, externalUpdateDate] = await Promise.all([
      getInternalDataDate(),
      getExternalDataDate(),
    ]);

    if (process.env.NODE_ENV === 'development') {
      console.log(`Internal Date (GMT): ${internalUpdateDate}`);
      console.log(`External Date (GMT): ${externalUpdateDate}`);
      dataDump = true;
    }

    // No need to update the DB if the internal data date matches the external data date
    if (internalUpdateDate === externalUpdateDate) {
      console.log('Dates match: Data will not be retrieved');
      return;
    }

    const reports = await retrieveLatestData(externalUpdateDate, dataDump);
    const refactoredReports = await refactorExternalData(reports, dataDump);

    await clearCollections();
    await addDataToDatabase(refactoredReports, 'report', dataDump);

    // TODO: region aggreation
    // TODO: age group aggreation

    await log.addValue(process.env.DB_DATA_DATE_VAR_NAME, externalUpdateDate);
    await log.addValue(
      process.env.DB_UPDATE_CHECK_DATE_VAR_NAME,
      new Date().toUTCString()
    );
  } catch (error) {
    console.log('Error during DB Update');
    console.log(error);
  }
};

////////////////////////////////////////////
// FUNCTIONS

// Retrieves last data update from logFile module. If the last data date does not exist in the log file, add it to the log file.
const getInternalDataDate = async function () {
  try {
    let date = await log.getValue(process.env.DB_DATA_DATE_VAR_NAME);
    // TODO: Add code that retrieves date from DB entry if file read fails
    return date;
  } catch (error) {
    console.log(error);
  }
};

// Performs a query to the data source control. Extracts the date of the latest piece of information from source control.
const getExternalDataDate = async function () {
  try {
    const testData = await superagent.get(process.env.ENDPOINT_TEST_STRING);
    // TODO: Add date error handling
    return testData.body[0].report_date;
  } catch (error) {
    throw new Error('Unable to reach VDH endpoint');
  }
};

// Retrieves the latest dataset from the source.
const retrieveLatestData = async function (date, dumpData = false) {
  try {
    const APIURL = process.env.DATA_SOURCE_STRING.replace(
      '{%DATE%}',
      date.replace('Z', '')
    );

    const results = await superagent.get(APIURL);

    if (dumpData) {
      console.log(`Search URL is: `, APIURL);
      const filePath = process.env.DEBUG_DATA_PATH + 'dataRetrieveDump.json';
      await fs.promises.writeFile(filePath, JSON.stringify(results.body));
    }

    // TODO: Add handling for empty results
    return results.body;
  } catch (error) {
    console.log(error);
  }
};

// Refactors the incoming data to have the structure and variable names required for entry into the report collection
const refactorExternalData = async function (incomingData, dumpData = false) {
  try {
    const refactoredData = incomingData.map((report) => {
      const newReport = {};
      // Add Z to indicate that timezone is already accounted for. Otherwise MongoDB will adjust provided date with timezone information. Info is adjusted for Virginia time.
      newReport.reportDate = report.report_date + 'Z';
      newReport.region = report.health_district;
      newReport.ageGroup = report.age_group;
      newReport.numberOfCases = report.number_of_cases;
      newReport.numberOfHospitalizations = report.number_of_hospitalizations;
      newReport.numberOfDeaths = report.number_of_deaths;
      return newReport;
    });

    if (dumpData) {
      const filePath = process.env.DEBUG_DATA_PATH + 'dataRefactorDump.json';
      await fs.promises.writeFile(filePath, JSON.stringify(refactoredData));
    }

    return refactoredData;
  } catch (error) {
    console.log('Data refactor failed:');
    console.log(error);
  }
};

// Removes all data from the Report, Region, and Age Group collections
const clearCollections = async function () {
  try {
    //TODO: Error handling
    const query = await Report.deleteMany({});
    return query;
  } catch (error) {
    console.log(error);
  }
};

// Adds data to the appropriate collection.
const addDataToDatabase = async function (dataset, datatype, dataDump = false) {
  try {
    // Guard Clause
    if (
      datatype !== 'report' &&
      datatype !== 'ageGroup' &&
      datatype !== 'region'
    )
      throw new Error('Invalid datatype. Cannot upload to database');

    // Data upload
    const erroredUploads = [];

    for await (const item of dataset) {
      try {
        if (datatype === 'report') await Report.create(item);
        if (datatype === 'ageGroup') await AgeGroup.create(item);
        if (datatype === 'region') await Region.create(item);
      } catch (error) {
        console.log(`Item not added: ${item}`);
        console.log(`Error: ${error}`);
        erroredUploads.push(item);
      }
    }

    if (dataDump) {
      const filePath =
        process.env.DEBUG_DATA_PATH +
        String(datatype) +
        'DataUploadErrorDump.json';
      await fs.promises.writeFile(filePath, JSON.stringify(erroredUploads));
      console.log(`${datatype} data upload complete`);
    }

    return erroredUploads;
  } catch (error) {
    throw error;
  }
};

// Aggregate the report data into groups by age group
const aggregateAgeGroupData = async function () {
  // TODO: Flesh out method
};

// Aggregate the report data into groups by region
const aggregateRegionData = async function () {
  // TODO: Flesh out method
};
