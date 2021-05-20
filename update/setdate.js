const fs = require("fs");
const cheerio = require("cheerio");
const dayjs = require("dayjs");
require("dayjs/locale/de");
dayjs.locale("de");

const indexHtml = cheerio.load(fs.readFileSync("../index.html"));

indexHtml("#lastUpdateDate").text(dayjs().format("dddd, DD. MMMM YYYY"));

fs.writeFileSync("../index.html", indexHtml.html());
