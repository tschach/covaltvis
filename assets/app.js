(function() {
  let devMode = false;

  let landkreise = {};

  const textLabels = {
    matrixChartTitle: (x, y) => `${x}: COVID-19 7-Tage-Inzidenzwerte nach Altersgruppen, Stand: ${y}`
  };

  let numberOfDays = 0;

  let selectedLandkreise = [];

  let fromDate, toDate;

  const ageGroups = ["total", "A00-A04", "A05-A14", "A15-A34", "A35-A59", "A60-A79", "A80+"];

  const ageGroupsLabels = ["Alle", "0–4", "5—14", "15—34", "35—59", "60—79", "80+"];

  const colorSchemes = {
    DEFAULT: {
      label: "Standard-Farbschema",
      ranges: [
        {
          min: 0,
          max: 5,
          color: "#f0f8ff"
        },
        {
          min: 5,
          max: 10,
          color: "#d9e2eb"
        },
        {
          min: 10,
          max: 15,
          color: "#c3ccd7"
        },
        {
          min: 15,
          max: 20,
          color: "#aeb7c3"
        },
        {
          min: 20,
          max: 35,
          color: "#99a2b0"
        },
        {
          min: 35,
          max: 50,
          color: "#868e9d"
        },
        {
          min: 50,
          max: 100,
          color: "#737a8a"
        },
        {
          min: 100,
          max: 150,
          color: "#606678"
        },
        {
          min: 150,
          max: 200,
          color: "#4f5366"
        },
        {
          min: 200,
          max: 300,
          color: "#3e4155"
        },
        {
          min: 300,
          max: 600,
          color: "#2e3044"
        },
        {
          min: 600,
          max: Infinity,
          color: "#1f1f33"
        }
      ]
    },
    TEAL: {
      label: "Farbschema Türkis",
      ranges: [
        {
          min: 0,
          max: 5,
          color: "#6eeefa"
        },
        {
          min: 5,
          max: 35,
          color: "#63d4e2"
        },
        {
          min: 35,
          max: 50,
          color: "#58bbca"
        },
        {
          min: 50,
          max: 100,
          color: "#4da2b3"
        },
        {
          min: 100,
          max: 150,
          color: "#428b9c"
        },
        {
          min: 150,
          max: 200,
          color: "#387386"
        },
        {
          min: 200,
          max: 300,
          color: "#2d5d71"
        },
        {
          min: 300,
          max: 400,
          color: "#23475c"
        },
        {
          min: 400,
          max: Infinity,
          color: "#193348"
        }
      ]
    },
    RKIHEATMAP: {
      label: "RKI-Heatmap",
      ranges: [
        {
          min: 0,
          max: 5,
          color: "#d0d1e6"
        },
        {
          min: 5,
          max: 10,
          color: "#a6bedb"
        },
        {
          min: 10,
          max: 15,
          color: "#7cacd1"
        },
        {
          min: 15,
          max: 20,
          color: "#a6c883"
        },
        {
          min: 20,
          max: 35,
          color: "#e5ef25"
        },
        {
          min: 35,
          max: 50,
          color: "#ffe600"
        },
        {
          min: 50,
          max: 100,
          color: "#ffbd00"
        },
        {
          min: 100,
          max: 150,
          color: "#ff8700"
        },
        {
          min: 150,
          max: 200,
          color: "#ff3c00"
        },
        {
          min: 200,
          max: 300,
          color: "#f40000"
        },
        {
          min: 300,
          max: 600,
          color: "#bf0000"
        },
        {
          min: 600,
          max: Infinity,
          color: "#8b0000"
        }
      ]
    }
  };

  let selectedColorScheme = "DEFAULT";

  const matrixChartConfig = {
    type: "matrix",
    data: {
      datasets: [
        {
          label: "",
          data: [],
          borderWidth: 0,
          backgroundColor: function(ctx) {
            let colorScheme = selectedColorScheme || "DEFAULT";
            let value = ctx.dataset.data[ctx.dataIndex].v;
            var color = colorSchemes[colorScheme].ranges[0].color;

            colorSchemes[colorScheme].ranges.forEach(range => {
              if (value > range.min && value <= range.max) {
                color = range.color;
              }
            });

            return color;
          },
          height(context) {
            const a = context.chart.chartArea;
            if (!a) {
              return 0;
            }
            return (a.bottom - a.top) / ageGroups.length + 1;
          },
          width(context) {
            const a = context.chart.chartArea;
            if (!a) {
              return 0;
            }
            return (a.right - a.left) / numberOfDays + 1;
          }
        }
      ]
    },
    options: {
      animation: {
        duration: 0
      },
      layout: {
        padding: 15
      },
      plugins: {
        title: {
          display: false
        },
        tooltip: {
          displayColors: false,
          callbacks: {
            title() {
              return "";
            },
            label(ctx) {
              const v = ctx.dataset.data[ctx.dataIndex];
              return [`${formatDate(v.x)}: ${v.v.toString().replace(".", ",")}`];
            }
          }
        },
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          type: "time",
          offset: true,
          time: {
            unit: "week",
            round: "day",
            isoWeekday: 1,
            displayFormats: {
              week: "DD.MM.YY",
              day: "DD.MM.YY"
            }
          },
          ticks: {
            font: {
              size: 14,
              family: "Monospace"
            },
            color: "#333",
            maxRotation: 90,
            minRotation: 90,
            autoSkip: true,
            padding: 0
          },
          grid: {
            display: false,
            drawBorder: false,
            tickMarkLength: 0
          },
          gridLines: {
            display: false
          }
        },
        y: {
          type: "category",
          position: "left",
          offset: true,
          labels: ageGroups,
          ticks: {
            display: true,
            callback: function(value, index, values) {
              return ageGroupsLabels[value];
            },
            font: {
              size: 14,
              family: "Monospace"
            },
            color: "#333",
            padding: 7.5,
            autoSkip: false
          },
          grid: {
            display: false,
            drawBorder: false,
            tickMarkLength: 0
          },
          gridLines: {
            display: false
          }
        }
      }
    }
  };

  function landkreisSelectOnChange(selectObject) {
    selectedLandkreise = [];
    for (const [key, option] of Object.entries(selectObject.target.options)) {
      if (option.selected && option.value && option.value.length === 5) {
        selectedLandkreise.push(option.value);
      }
    }
  }

  function colorSchemeSelectOnChange(eventObject) {
    selectedColorScheme = eventObject.target.value;
  }

  function updateLegend(landkreisId) {
    document.getElementById("legendContainer").replaceChildren();

    let element = document.createElement("dl");
    element.setAttribute("class", "row text-muted");
    element.innerHTML = `<dt class="col-xl-3">Farbschema</dt><dd class="col-xl-9">7-Tage-Inzidenzwerte (gemeldete COVID-19-Fälle pro 100.000 Personen in der Altersgruppe). Tage ohne Daten werden in der Kategorie „>0–5“ dargestellt.</dd>`;
    document.getElementById("legendContainer").appendChild(element);

    const ul = document.createElement("ul");
    ul.setAttribute("class", "list-inline row");

    colorSchemes[selectedColorScheme].ranges.forEach(range => {
      const li = document.createElement("li");
      li.setAttribute("class", "list-inline-item col-lg-2 col-md-3 col-sm-4 col-6");
      let legendString = `>&#8201;${range.min}&#8239;&#8211;&#8201;${isFinite(range.max) ? range.max : ""}`;

      li.innerHTML = `<span style="background-color:${range.color};height:16px;width:16px;margin-right:8px;display:inline-block"></span><span style="vertical-align:text-bottom">${legendString}</span>`;
      ul.appendChild(li);
    });
    document.getElementById("legendContainer").appendChild(ul);

    element = document.createElement("dl");
    element.setAttribute("class", "row text-muted");
    element.innerHTML = `<dt class="col-xl-3">X-Achse</dt><dd class="col-xl-9">zeitlicher Verlauf</dd><dt class="col-xl-3">Y-Achse</dt><dd class="col-xl-9">Altersgruppen (Einteilung vorgegeben durch den Datenbestand des Robert-Koch-Institus) und Gesamtbevölkerung</dd>`;
    document.getElementById("legendContainer").appendChild(element);

    const paragraph = document.createElement("p");
    paragraph.setAttribute("class", "text-muted");
    const link = document.createElement("a");
    link.setAttribute("href", `https://github.com/tschach/covaltvis/blob/main/data/${landkreisId}.json`);
    link.innerText = "Datensatz auf Github";
    paragraph.appendChild(link);
    document.getElementById("legendContainer").appendChild(paragraph);
  }

  function updateTimeframeRadioOnChange(eventObject) {
    const timeframe = eventObject.target.value;
    let now = new Date();
    switch (timeframe) {
      case "oct2020":
        fromDate = "2020-10-01";
        matrixChartConfig.options.scales.x.time.unit = "week";
        break;
      case "jan2021":
        fromDate = "2021-01-01";
        matrixChartConfig.options.scales.x.time.unit = "week";
        break;
      case "last28d":
        now.setDate(now.getDate() - 28);
        fromDate = formatDate2(now);
        matrixChartConfig.options.scales.x.time.unit = "day";
        break;
      case "last14d":
        now.setDate(now.getDate() - 14);
        fromDate = formatDate2(now);
        matrixChartConfig.options.scales.x.time.unit = "day";
        break;
      default:
        fromDate = null;
        matrixChartConfig.options.scales.x.time.unit = "week";
    }
  }

  function updateChartsButtonOnChange() {
    updateCharts(fromDate, toDate);
  }

  function getLandkreisData(landkreisId) {
    const path = `data/${landkreisId}.json`;
    return axios.get(path);
  }

  let formatDate = function(date) {
    if (!moment.isDate(date)) {
      date = new Date(date);
    }
    return `${date.getDate()}. ${date.toLocaleString("de-DE", {
      month: "long"
    })} ${date.getFullYear()}`;
  };

  function formatDate2(date) {
    return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
  }

  function initMatrixChart(landkreisId) {
    const canvasId = `matrixChartCanvas${landkreisId}`;
    const canvasElement = document.createElement("canvas");
    canvasElement.setAttribute("id", canvasId);
    canvasElement.setAttribute("style", "width:100%;height:33vw;max-height:400px;min-height:250px;");
    document.getElementById("canvasContainer").appendChild(canvasElement);
    return canvasId;
  }

  function updateCharts(fromDate, toDate) {
    fromDate = fromDate || "2020-01-27";
    toDate = toDate || "2050-12-31";
    document.getElementById("canvasContainer").replaceChildren();
    numberOfDays = 0;

    selectedLandkreise.forEach(landkreisId => {
      let canvasId = initMatrixChart(landkreisId);

      getLandkreisData(landkreisId)
        .then(response => {
          if (response.data) {
            let dataset = [];
            let lastDate;
            for (const [key, value] of Object.entries(response.data)) {
              ageGroups.forEach(ageGroup => {
                if (key >= fromDate && key <= toDate) {
                  let cases = 0;
                  if (value.hasOwnProperty(`${ageGroup}_7day_cases_per_100k`)) {
                    cases = value[`${ageGroup}_7day_cases_per_100k`];
                  }
                  dataset.push({ x: key, y: ageGroup, v: cases });
                }
                lastDate = key;
              });
            }

            matrixChartConfig.data.datasets[0].data = dataset;
            numberOfDays = dataset.length / ageGroups.length;

            const titleElement = document.createElement("h2");
            titleElement.setAttribute("class", "offset-xl-1 col-xl-10 lead");
            titleElement.innerText = textLabels.matrixChartTitle(landkreise[landkreisId].name, formatDate(new Date(lastDate)));
            document.getElementById("titleContainer").replaceChildren(titleElement);

            var ctx = document.getElementById(canvasId).getContext("2d");

            var matrixChart = new Chart(ctx, matrixChartConfig);

            updateLegend(landkreisId);

            document.getElementById("resultsContainer").scrollIntoView(true);
          }
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(function() {
          // always executed
        });
    });
  }

  document.getElementById("landkreisSelect").addEventListener("change", event => landkreisSelectOnChange(event));

  document.getElementById("updateChartsButton").addEventListener("click", updateChartsButtonOnChange);

  document.querySelectorAll("input[name=colorscheme]").forEach(input => {
    input.addEventListener("change", event => colorSchemeSelectOnChange(event));
  });

  document.querySelectorAll("input[name=timeframe]").forEach(input => {
    input.addEventListener("change", event => updateTimeframeRadioOnChange(event));
  });

  document.addEventListener("DOMContentLoaded", function(event) {
    moment.locale("de-DE");

    axios.get("assets/landkreise.json").then(response => {
      if (response.data) {
        landkreise = {};

        Object.keys(response.data)
          .sort(function(a, b) {
            if (response.data[a].sorting > response.data[b].sorting) return 1;
            else if (response.data[a].sorting < response.data[b].sorting) return -1;
            else return 0;
          })
          .forEach(function(key) {
            const value = response.data[key];
            let agsPadded = ("0000" + key).slice(-5);
            landkreise[agsPadded] = value;
            const optionElement = document.createElement("option");
            optionElement.setAttribute("value", agsPadded);
            optionElement.innerText = `${value.name}`;
            document.getElementById("landkreisSelect").appendChild(optionElement);
          });

        document.getElementById("landkreisSelect").disabled = false;
        if (devMode === true) {
          selectedLandkreise = [Object.keys(landkreise)[0]];
          updateCharts();
        }
      }
    });
  });
})();
