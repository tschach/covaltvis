const axios = require("axios");

const pathToData = "../data/";

let rkiQueryString = (landkreisId, fromDate) =>
  `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuerFall%20IN(1,0)%20AND%20IdLandkreis=${landkreisId}%20AND%20MeldeDatum>'${fromDate}'&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum,Landkreis,IdLandkreis,Altersgruppe&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis,MeldeDatum&groupByFieldsForStatistics=IdLandkreis,MeldeDatum,Altersgruppe,Landkreis&outStatistics=[{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22AnzahlFall%22,%22outStatisticFieldName%22:%22cases%22}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;

const queryString = rkiQueryString("8416", "2021-05-01");

console.log(queryString);

axios.get(queryString).then(rkiResponse => {
  if (rkiResponse && rkiResponse.data && rkiResponse.data.features && rkiResponse.data.features.length > 0) {
    console.log(rkiResponse.data.features[0]);
    fs.writeFileSync(`${pathToData}automatedUpdate_08416.json`, JSON.stringify(rkiResponse.data.features));
  }
});
