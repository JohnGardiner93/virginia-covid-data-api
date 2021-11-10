// This portion of code is modified from code in Jonas Schmedtmann's Node.JS Course.

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const excludedFields = ['page', 'sort', 'limit', 'fields']; // Won't be directly used in DB query, but used to filter and sort the data sent by the user.

    // Create Query Object
    const queryObj = { ...this.queryString }; // Shallow copy of query String

    // Modify Query Object
    excludedFields.forEach((el) => delete queryObj[el]); //deletes properties
    const modObj = this._splitObjectStringsToArrays(queryObj);

    // Create & Modify Query String from QUery Object
    let queryStr = JSON.stringify(modObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|ne|nin|in)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr)); // replace input query string with the modified one. We remove page, sort, etc. so that we can interpret human-readable query and parse it into Mongo's preferred format (using methods within this class)

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); // Put sort string into Mongo-digestible format
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdOn');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // Return all fields except __v
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  /**
   * Recursively burrows into an object. String values are split into arrays based on the provided split character. Mutates properties of provided target (if they qualify). Returns unmodified target if target is not object.
   * @param {Object} target - Target object
   * @param {String} splitChar - Sub string with which to split the object's strings
   * @returns {Object} - Target object (mutated if strings were present)
   */
  _splitObjectStringsToArrays(target, splitChar = ',') {
    if (typeof target !== 'object') return target;

    for (const key in target) {
      if (typeof target[key] === 'object') {
        this._splitObjectStringsToArrays(target[key]);
      }
      if (typeof target[key] === 'string') {
        target[key] = target[key].split(splitChar);
      }
    }
    return target;
  }
}

module.exports = APIFeatures;
