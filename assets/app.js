(function() {
  let landkreise = {};

  const textLabels = {
    matrixChartTitle: (x, y) => `${x}: Corona-7-Tage-Inzidenzwerte nach Altersgruppen, Stand: ${y}`
  };

  let selectedLandkreise = [];

  let fromDate, toDate;

  const ageGroups = ["total", "A00-A04", "A05-A14", "A15-A34", "A35-A59", "A60-A79", "A80+"];

  const ageGroupsLabels = ["Gesamtbevölkerung", "bis 4 Jahre", "5 bis 14 Jahre", "15 bis 34 Jahre ", "35 bis 59 Jahre", "60 bis 79 Jahre", "über 80 Jahre"];

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
          color: "#ff8700"
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
            return (a.bottom - a.top) / ageGroups.length;
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
          display: true,
          position: "top",
          align: "center",
          text: "Corona-7-Tage-Inzidenzwerte je Altersgruppe im Landkreis Görlitz, Stand: ",
          padding: {
            top: 0,
            bottom: 15
          },
          font: {
            size: 18,
            family: "Monospace"
          },
          color: "#666"
        },
        tooltip: {
          callbacks: {
            title() {
              return "";
            },
            label(ctx) {
              const v = ctx.dataset.data[ctx.dataIndex];
              return [`Inzidenzwert in`, `der Altersgruppe ${v.y}`, `am ${v.x}:`, `${v.v}`];
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
            unit: "day"
          },
          ticks: {
            font: {
              size: 14,
              family: "Monospace"
            },
            color: "#333"
          },
          grid: {
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
            padding: 7.5
          },
          grid: {
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
    //updateCharts();
  }

  function colorSchemeSelectOnChange(selectObject) {
    for (const [key, option] of Object.entries(selectObject.target.options)) {
      if (option.selected) {
        selectedColorScheme = option.value;
        break;
      }
    }

    //updateCharts();
  }

  function updateLegend() {
    document.getElementById("legendContainer").replaceChildren();

    const heading = document.createElement("h3");
    heading.setAttribute("class", "text-muted");
    heading.innerText = "Erläuterungen";
    document.getElementById("legendContainer").appendChild(heading);

    const ul = document.createElement("ul");
    ul.setAttribute("class", "list-inline");

    colorSchemes[selectedColorScheme].ranges.forEach(range => {
      const li = document.createElement("li");
      li.setAttribute("class", "list-inline-item col-2");
      let legendString = `${range.min} — ${isFinite(range.max) ? range.max : ""}`;

      li.innerHTML = `<span style="background-color:${range.color};height:16px;width:16px;margin-right:8px;display:inline-block"></span><span style="vertical-align:text-bottom">${legendString}</span>`;
      ul.appendChild(li);
    });

    document.getElementById("legendContainer").appendChild(ul);
  }

  function updateTimeframeRadioOnChange(eventObject) {
    const timeframe = eventObject.target.value;
    let now = new Date();
    switch (timeframe) {
      case "oct2020":
        fromDate = "2020-10-01";
        break;
      case "jan2021":
        fromDate = "2021-01-01";
        break;
      case "last28d":
        now.setDate(now.getDate() - 28);
        fromDate = formatDate2(now);
        break;
      case "last14d":
        now.setDate(now.getDate() - 14);
        fromDate = formatDate2(now);
        break;
      default:
        fromDate = null;
    }
  }

  function updateChartsButtonOnChange() {
    updateCharts(fromDate, toDate);
    document.getElementById("resultsContainer").scrollIntoView(true);
  }

  function getLandkreisData(landkreisId) {
    const path = `data/${landkreisId}.json`;
    return axios.get(path);
  }

  function formatDate(date) {
    return `${date.getDate()}. ${date.toLocaleString("de-DE", {
      month: "long"
    })} ${date.getFullYear()}`;
  }

  function formatDate2(date) {
    return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
  }

  function initMatrixChart(landkreisId) {
    const canvasId = `matrixChartCanvas${landkreisId}`;
    const canvasElement = document.createElement("canvas");
    canvasElement.setAttribute("id", canvasId);
    canvasElement.setAttribute("style", "width:100%;height:400px;");
    document.getElementById("canvasContainer").appendChild(canvasElement);
    return canvasId;
  }

  function updateCharts(fromDate, toDate) {
    fromDate = fromDate || "2020-01-27";
    toDate = toDate || "2050-12-31";
    document.getElementById("canvasContainer").replaceChildren();

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
            matrixChartConfig.options.plugins.title.text = textLabels.matrixChartTitle(landkreise[landkreisId].name, formatDate(new Date(lastDate)));
            //matrixChartConfig.options.plugins.title.text + lastDate;

            var ctx = document.getElementById(canvasId).getContext("2d");

            var matrixChart = new Chart(ctx, matrixChartConfig);

            updateLegend();
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

  document.getElementById("colorSchemeSelect").addEventListener("change", event => colorSchemeSelectOnChange(event));

  document.getElementById("updateChartsButton").addEventListener("click", updateChartsButtonOnChange);

  document.querySelectorAll("input[name=timeframe]").forEach(input => {
    input.addEventListener("change", event => updateTimeframeRadioOnChange(event));
  });

  document.addEventListener("DOMContentLoaded", function(event) {
    moment.locale("de-DE");

    axios.get("assets/landkreise.json").then(response => {
      if (response.data) {
        landkreise = {};
        for (const [key, value] of Object.entries(response.data)) {
          let agsPadded = ("0000" + key).slice(-5);
          landkreise[agsPadded] = value;
          const optionElement = document.createElement("option");
          optionElement.setAttribute("value", agsPadded);
          optionElement.innerText = `${value.name}`;
          document.getElementById("landkreisSelect").appendChild(optionElement);
        }
      }
    });

    //updateCharts();
  });
})();
