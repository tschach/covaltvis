const fs = require("fs");
const axios = require("axios");

const dataFromScratch = false;
const pollInterval = 1000 * 5;

const pathToData = "../data/";

const ageGroups = ["A00-A04", "A05-A14", "A15-A34", "A35-A59", "A60-A79", "A80+"];

let rkiQueryString = (landkreisId, fromDate) =>
  `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=NeuerFall%20IN(1,0)%20AND%20IdLandkreis=${landkreisId}%20AND%20MeldeDatum>'${fromDate}'&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum,Landkreis,IdLandkreis,Altersgruppe&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis,MeldeDatum&groupByFieldsForStatistics=IdLandkreis,MeldeDatum,Altersgruppe,Landkreis&outStatistics=[{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22AnzahlFall%22,%22outStatisticFieldName%22:%22cases%22}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;

let rkiQueryStringBerlin = (bundeslandId, fromDate) =>
  `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=NeuerFall%20IN(1,0)%20AND%20IdBundesland=${bundeslandId}%20AND%20MeldeDatum>'${fromDate}'&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum,Landkreis,IdLandkreis,Altersgruppe&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis,MeldeDatum&groupByFieldsForStatistics=IdLandkreis,MeldeDatum,Altersgruppe,Landkreis&outStatistics=[{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22AnzahlFall%22,%22outStatisticFieldName%22:%22cases%22}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;

const berlinDistricts = ["11001", "11002", "11003", "11004", "11005", "11006", "11007", "11008", "11009", "11010", "11011", "11012"];

const populations = JSON.parse(fs.readFileSync(`${pathToData}populations.json`));
const landkreise = JSON.parse(fs.readFileSync(`${pathToData}landkreise.json`));

let index = 0;
let counter = 1;
let updateExistingDatasets = {};

for (const [key, value] of Object.entries(landkreise)) {
  if (key) {
    let ags = parseInt(key);
    let agsPadded = ("0000" + ags).slice(-5);
    let queryFromDate = "2020-01-27"; // first corona case in Germany

    let district = populations.find(item => {
      return item.ags === ags;
    });

    if (fs.existsSync(`${pathToData}${agsPadded}.json`) && dataFromScratch !== true) {
      updateExistingDatasets[agsPadded] = true;
      const existingDataset = JSON.parse(fs.readFileSync(`${pathToData}${agsPadded}.json`));
      queryFromDate = Object.keys(existingDataset).reduce((dateA, dateB) => (dateA > dateB ? dateA : dateB));
      queryFromDate = new Date(queryFromDate);
      queryFromDate.setDate(queryFromDate.getDate() - 7);
      queryFromDate = formatDate(queryFromDate);
    } else {
      updateExistingDatasets[agsPadded] = false;
    }

    let queryString;
    if (agsPadded === "11000") {
      // Berlin is a special case
      queryString = rkiQueryStringBerlin("11", queryFromDate);
    } else {
      queryString = rkiQueryString(ags, queryFromDate);
    }

    setTimeout(() => {
      axios.get(queryString).then(rkiResponse => {
        let byDay = {};
        if (updateExistingDatasets[agsPadded] === true) {
          byDay = JSON.parse(fs.readFileSync(`${pathToData}${agsPadded}.json`));
        }

        if (rkiResponse && rkiResponse.data && rkiResponse.data.features && rkiResponse.data.features.length > 0) {
          let firstDate = new Date(rkiResponse.data.features[0].attributes.MeldeDatum);
          let lastDate = new Date();
          lastDate = lastDate.setDate(lastDate.getDate() - 1)

          for (let currentDate = firstDate; currentDate <= lastDate; currentDate.setDate(currentDate.getDate() + 1)) {
            byDay[formatDate(currentDate)] = {};

            if (agsPadded === "11000") {
              byDay[formatDate(currentDate)][`total_cases`] = 0;
              byDay[formatDate(currentDate)][`total_7day_cases`] = 0;

              berlinDistricts.forEach(berlinDistrict => {
                let dateCases = rkiResponse.data.features.filter(feature => {
                  return formatDate(new Date(feature.attributes.MeldeDatum)) === formatDate(currentDate) && feature.attributes.IdLandkreis === berlinDistrict;
                });

                if (dateCases) {
                  let unknownCases = dateCases.find(dateCase => {
                    return dateCase.attributes.Altersgruppe === "unbekannt";
                  });
                  if (unknownCases) {
                    byDay[formatDate(currentDate)][`total_cases`] += unknownCases.attributes.cases;
                    byDay[formatDate(currentDate)][`unbekannt_cases`] = unknownCases.attributes.cases;
                  }
                }
              });
            } else {
              byDay[formatDate(currentDate)][`total_cases`] = 0;
              byDay[formatDate(currentDate)][`total_7day_cases`] = 0;

              let dateCases = rkiResponse.data.features.filter(feature => {
                return formatDate(new Date(feature.attributes.MeldeDatum)) === formatDate(currentDate);
              });
              if (dateCases) {
                let unknownCases = dateCases.find(dateCase => {
                  return dateCase.attributes.Altersgruppe === "unbekannt";
                });

                if (unknownCases) {
                  byDay[formatDate(currentDate)][`total_cases`] += unknownCases.attributes.cases;
                  byDay[formatDate(currentDate)][`unbekannt_cases`] = unknownCases.attributes.cases;
                }
              }
            }

            let sumOfLastSevenDayUnknownCases = sumOfLastSevenDayCasesByAgeGroup(currentDate, "unbekannt", byDay);

            if (sumOfLastSevenDayUnknownCases) {
              byDay[formatDate(currentDate)][`total_7day_cases`] += sumOfLastSevenDayUnknownCases;
            }

            ageGroups.forEach(ageGroup => {
              let cases = 0;
              if (agsPadded === "11000") {
                berlinDistricts.forEach(berlinDistrict => {
                  let dateCases = rkiResponse.data.features.filter(feature => {
                    return formatDate(new Date(feature.attributes.MeldeDatum)) === formatDate(currentDate) && feature.attributes.IdLandkreis === berlinDistrict;
                  });

                  if (dateCases) {
                    let ageGroupCases = dateCases.find(dateCase => {
                      return dateCase.attributes.Altersgruppe === ageGroup && dateCase.attributes.IdLandkreis === berlinDistrict;
                    });

                    if (ageGroupCases) {
                      cases += ageGroupCases.attributes.cases;
                    }
                  }
                });
              } else {
                let dateCases = rkiResponse.data.features.filter(feature => {
                  return formatDate(new Date(feature.attributes.MeldeDatum)) === formatDate(currentDate);
                });

                let ageGroupCases = dateCases.find(dateCase => {
                  return dateCase.attributes.Altersgruppe === ageGroup;
                });

                if (ageGroupCases) {
                  cases = ageGroupCases.attributes.cases;
                }
              }

              byDay[formatDate(currentDate)][`${ageGroup}_cases`] = cases;
              byDay[formatDate(currentDate)][`total_cases`] += cases;

              let inhabitantsByAge = district[ageGroup];

              byDay[formatDate(currentDate)][`${ageGroup}_cases_per_100k`] = parseFloat(((cases * 100000) / inhabitantsByAge).toFixed(2));

              let sumOfLastSevenDayCases = sumOfLastSevenDayCasesByAgeGroup(currentDate, ageGroup, byDay);

              byDay[formatDate(currentDate)][`${ageGroup}_7day_cases`] = sumOfLastSevenDayCases;

              byDay[formatDate(currentDate)][`total_7day_cases`] += sumOfLastSevenDayCases;

              byDay[formatDate(currentDate)][`${ageGroup}_7day_cases_per_100k`] = parseFloat(((sumOfLastSevenDayCases * 100000) / inhabitantsByAge).toFixed(2));
            });

            let inhabitantsTotal = district["TOTAL"];

            byDay[formatDate(currentDate)][`total_cases_per_100k`] = parseFloat(
              ((byDay[formatDate(currentDate)][`total_cases`] * 100000) / inhabitantsTotal).toFixed(2)
            );

            byDay[formatDate(currentDate)][`total_7day_cases_per_100k`] = parseFloat(
              ((byDay[formatDate(currentDate)][`total_7day_cases`] * 100000) / inhabitantsTotal).toFixed(2)
            );
          }

          console.log(`${counter++}: ${value.name} (${agsPadded})`);

          fs.writeFileSync(`${pathToData}${agsPadded}.json`, JSON.stringify(byDay));
        }
      });
    }, pollInterval * index++);
  }
}

function formatDate(date) {
  return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
}

function sumOfLastSevenDayCasesByAgeGroup(currentDate, ageGroup, byDay) {
  let sumOfLastSevenDayCases = 0;
  const ageGroupProperty = `${ageGroup}_cases`;
  const workingDate = new Date(currentDate.getTime());

  for (let previousDays = 0; previousDays < 7; previousDays++) {
    let workingDate2 = formatDate(workingDate);
    if (byDay.hasOwnProperty(workingDate2) && byDay[workingDate2].hasOwnProperty(ageGroupProperty)) {
      let dailyCases = byDay[workingDate2][ageGroupProperty];
      sumOfLastSevenDayCases += Number.isFinite(dailyCases) ? dailyCases : 0;
    }
    workingDate.setDate(workingDate.getDate() - 1);
  }

  return sumOfLastSevenDayCases;
}
