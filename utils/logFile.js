////////////////////////////////////////////
// MODULES
const fs = require('fs');

////////////////////////////////////////////
// FUNCTIONS
// TODO: Add JSDoc comments.
// TODO: Make error handling uniform.

class LogFile {
  constructor(filePath = `${__dirname}\\log.json`) {
    this.filePath = filePath;
  }

  // If content is provided during init, the existing file will be overwritten with the new content. Otherwise, the existing file will be used.
  init = async function (content) {
    // TODO: Add trycatch.
    const overwrite = content ? true : false;
    await this.write(content, overwrite);
    this.content = await this.read();
  };

  // If the log file already exists, no file is created.
  write = async function (content = {}, forceOverwrite = false) {
    try {
      const flag = forceOverwrite ? 'w' : 'wx';
      await fs.promises.writeFile(this.filePath, JSON.stringify(content), {
        flag: flag,
      });
      return content;
    } catch (error) {
      console.log('File not created');
      return undefined;
    }
  };

  // Read log file.
  read = async function () {
    try {
      const results = await fs.promises.readFile(this.filePath);
      const parsedResults = JSON.parse(results);
      //   this.content = parsedResults;
      return parsedResults;
    } catch (error) {
      throw console.log(error);
    }
  };

  // Delete log file.
  delete = async function () {
    // TODO: Flesh out delete method.
  };

  // Add a property (key) with a specific value (log) to the log file. Overwrite the existing propery if overwrite variable is true.
  addValue = async function (key, value) {
    try {
      let content = await this.read();
      content[key] = value;
      await this.write(content, true);
    } catch (error) {
      console.log('Failed to add value:', error);
    }
  };

  // Clear a value from the log file based on key
  clearValue = async function (key) {
    // TODO: Flesh out clearValue method.
  };

  // Get a value from the log file.
  getValue = async function (key) {
    try {
      const content = await this.read();
      return content[key];
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = LogFile;
