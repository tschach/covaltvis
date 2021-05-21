class Dataset {
  constructor(landkreisId) {
    this.id = landkreisId;
    this.name;
    this.firstCaseDate;
    this.lastCaseDate;
    this.populations = {};
    this.byWeek = {};
  }
}
module.exports.Dataset = Dataset;
