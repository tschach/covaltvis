const fs = require("fs");
const axios = require("axios");
const moment = require("moment");
const { Dataset } = require("./datasetModel");

/* production data */
const pathToData = "../data/";
const landkreiseFile = `${pathToData}landkreise.json`;
/* test data */
//const pathToData = "v2data/";
//const landkreiseFile = "data/landkreise.json";

const bevoelkerungFile = `${pathToData}12411-04-02-4.json`;

const altersgruppenFein = {
  "A00-05": ["A00", "A01", "A02", "A03", "A04", "A05"],
  "A06-09": ["A06", "A07", "A08", "A09"],
  "A10-14": ["A10", "A11", "A12", "A13", "A14"],
  "A15-19": ["A15", "A16", "A17", "A18", "A19"],
  "A20-29": ["A20", "A21", "A22", "A23", "A24", "A25", "A26", "A27", "A28", "A29"],
  "A30-44": ["A30", "A31", "A32", "A33", "A34", "A35", "A36", "A37", "A38", "A39", "A40", "A41", "A42", "A43", "A44"],
  "A45-59": ["A45", "A46", "A47", "A48", "A49", "A50", "A51", "A52", "A53", "A54", "A55", "A56", "A57", "A58", "A59"],
  "A60-74": ["A60", "A61", "A62", "A63", "A64", "A65", "A66", "A67", "A68", "A69", "A70", "A71", "A72", "A73", "A74"],
  "A75+": ["A75", "A76", "A77", "A78", "A79", "A80plus"]
};

const altersgruppenFeinBevoelkerung = {
  "A00-05": ["A00", "A01", "A02", "A03", "A04", "A05"],
  "A06-09": ["A06", "A07", "A08", "A09"],
  "A10-14": ["A10", "A11", "A12", "A13", "A14"],
  "A15-19": ["A15", "A16", "A17", "A18", "A19"],
  "A20-29": ["A20", "A21", "A22", "A23", "A24", "A25", "A26", "A27", "A28", "A29"],
  "A30-44": ["A30", "A31", "A32", "A33", "A34", "A35", "A36", "A37", "A38", "A39", "A40", "A41", "A42", "A43", "A44"],
  "A45-59": ["A45", "A46", "A47", "A48", "A49", "A50", "A51", "A52", "A53", "A54", "A55", "A56", "A57", "A58", "A59"],
  "A60-74": ["A60", "A61", "A62", "A63", "A64", "A65", "A66", "A67", "A68", "A69", "A70", "A71", "A72", "A73", "A74"],
  "A75+": ["A75", "A80", "A85", "A90+"]
};

const altersgruppen = altersgruppenFein;
const altersgruppenBevoelkerung = altersgruppenFeinBevoelkerung;

const dataFromScratch = true;
let index = 0;
let updateExistingDatasets = {};
const pollInterval = 1000 * 10;
let coronavisQueryString = (landkreisId, fromDate) =>
  `https://api.coronavis.dbvis.de/cases/development/landkreis/${landkreisId}?from=${fromDate}&nogeom=true&agegroups=true`;

const landkreise = JSON.parse(fs.readFileSync(landkreiseFile));
const bevoelkerung = JSON.parse(fs.readFileSync(bevoelkerungFile));

moment.locale("de");

let counter = 1;

for (const [ags, value] of Object.entries(landkreise)) {
  let queryString, dataset;

  const agsPadded = ("0000" + ags).slice(-5);
  const queryFromDate = "2020-01-27"; // first corona case in Germany

  if (fs.existsSync(`${pathToData}${agsPadded}.json`) && !dataFromScratch) {
    updateExistingDatasets[agsPadded] = true;
    dataset = JSON.parse(fs.readFileSync(`${pathToData}${agsPadded}.json`));

    /* SET NEW QUERY FROM DATE */
  } else {
    dataset = new Dataset(agsPadded);
    updateExistingDatasets[agsPadded] = false;
  }

  dataset.name = value.name;

  queryString = coronavisQueryString(agsPadded, queryFromDate);

  setTimeout(() => {
    console.log(queryString);
    axios.get(queryString).then(response => {
      if (response && response.data && response.data.properties && response.data.properties.developmentDays) {
        let isFirstDay = true;
        let calendarWeek;

        let lastWeeksData = {
          cases_survstat_by_agegroup: {
            A00: 0,
            A01: 0,
            A02: 0,
            A03: 0,
            A04: 0,
            A05: 0,
            A06: 0,
            A07: 0,
            A08: 0,
            A09: 0,
            A10: 0,
            A11: 0,
            A12: 0,
            A13: 0,
            A14: 0,
            A15: 0,
            A16: 0,
            A17: 0,
            A18: 0,
            A19: 0,
            A20: 0,
            A21: 0,
            A22: 0,
            A23: 0,
            A24: 0,
            A25: 0,
            A26: 0,
            A27: 0,
            A28: 0,
            A29: 0,
            A30: 0,
            A31: 0,
            A32: 0,
            A33: 0,
            A34: 0,
            A35: 0,
            A36: 0,
            A37: 0,
            A38: 0,
            A39: 0,
            A40: 0,
            A41: 0,
            A42: 0,
            A43: 0,
            A44: 0,
            A45: 0,
            A46: 0,
            A47: 0,
            A48: 0,
            A49: 0,
            A50: 0,
            A51: 0,
            A52: 0,
            A53: 0,
            A54: 0,
            A55: 0,
            A56: 0,
            A57: 0,
            A58: 0,
            A59: 0,
            A60: 0,
            A61: 0,
            A62: 0,
            A63: 0,
            A64: 0,
            A65: 0,
            A66: 0,
            A67: 0,
            A68: 0,
            A69: 0,
            A70: 0,
            A71: 0,
            A72: 0,
            A73: 0,
            A74: 0,
            A75: 0,
            A76: 0,
            A77: 0,
            A78: 0,
            A79: 0,
            A80plus: 0,
            Aunknown: 0
          },
          cases: 0
        };

        let population_survstat_by_agegroup = convertPopulation(agsPadded);

        dataset.populations.total = 0;
        for (const [altersgruppe, ageGroups] of Object.entries(altersgruppenBevoelkerung)) {
          dataset.populations[altersgruppe] = 0;
          ageGroups.forEach(ageGroup => {
            dataset.populations[altersgruppe] += population_survstat_by_agegroup[ageGroup];
            dataset.populations.total += population_survstat_by_agegroup[ageGroup];
          });
        }

        for (const [date, value2] of Object.entries(response.data.properties.developmentDays)) {
          const currentDate = moment(date);

          dataset.lastCaseDate = currentDate.format("YYYY-MM-DD");
          if (isFirstDay) {
            dataset.firstCaseDate = currentDate.format("YYYY-MM-DD");
          }

          if (currentDate.day() === 1 || isFirstDay) {
            isFirstDay = false;

            calendarWeek = `${currentDate.year()}-${currentDate.format("ww")}`;

            dataset.byWeek[calendarWeek] = {
              label: `${currentDate.format("ww")}/${currentDate.format("YYYY")}`,
              first: currentDate.startOf("isoWeek").format("YYYY-MM-DD"),
              last: currentDate.endOf("isoWeek").format("YYYY-MM-DD"),
              newCasesByAgegroup: {},
              incidenceByAgegroup: {}
            };

            dataset.byWeek[calendarWeek].newCases = 0;
            for (const [altersgruppe, ageGroups] of Object.entries(altersgruppen)) {
              dataset.byWeek[calendarWeek].newCasesByAgegroup[altersgruppe] = 0;

              ageGroups.forEach(ageGroup => {
                dataset.byWeek[calendarWeek].newCasesByAgegroup[altersgruppe] +=
                  value2.cases_survstat_by_agegroup[ageGroup] - lastWeeksData.cases_survstat_by_agegroup[ageGroup];
              });

              dataset.byWeek[calendarWeek].incidenceByAgegroup[altersgruppe] = (
                (dataset.byWeek[calendarWeek].newCasesByAgegroup[altersgruppe] * 100000) /
                dataset.populations[altersgruppe]
              ).toFixed();

              dataset.byWeek[calendarWeek].newCases += dataset.byWeek[calendarWeek].newCasesByAgegroup[altersgruppe];
            }

            dataset.byWeek[calendarWeek].newCases += value2.cases_survstat_by_agegroup["Aunknown"] - lastWeeksData.cases_survstat_by_agegroup["Aunknown"];

            dataset.byWeek[calendarWeek].incidence = ((dataset.byWeek[calendarWeek].newCases * 100000) / dataset.populations.total).toFixed();
          }

          if (currentDate.day() === 0) {
            lastWeeksData = {
              cases_survstat_by_agegroup: value2.cases_survstat_by_agegroup,
              cases: value2.cases
            };
          }
        }

        console.log(`${counter++}: ${value.name} (${agsPadded})`);

        fs.writeFileSync(`${pathToData}v2/${agsPadded}v2.json`, JSON.stringify(dataset));
      }
    });
  }, pollInterval * index++);
}

function convertPopulation(agsPadded) {
  let region = bevoelkerung.regionen[agsPadded];
  return region.bevoelkerung;
}
