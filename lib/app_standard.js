"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

(function () {
  var devMode = false;
  var landkreise = {};
  var useV2;
  var matrixChart, ctx;
  var textLabels = {
    matrixChartTitle: function matrixChartTitle(x, y) {
      return "".concat(x, ": COVID-19 7-Tage-Inzidenzwerte nach Altersgruppen, Stand: ").concat(y);
    }
  };
  var numberOfDays = 0;
  var selectedLandkreise = [];
  var fromDate, toDate;
  var ageGroups = ["total", "A00-A04", "A05-A14", "A15-A34", "A35-A59", "A60-A79", "A80+"];
  var ageGroupsV2Fein = ["total", "A00-05", "A06-09", "A10-14", "A15-19", "A20-29", "A30-44", "A45-59", "A60-74", "A75+"];
  var ageGroupsLabels = ["Alle", "0–4", "5—14", "15—34", "35—59", "60—79", "80+"];
  var ageGroupsLabelsV2Fein = ["Alle", "0–5", "6—9", "10—14", "15–19", "20—29", "30—44", "45—59", "60—74", "75+"];
  var ageGroupsV2 = ageGroupsV2Fein;
  var ageGroupsLabelsV2 = ageGroupsLabelsV2Fein;
  var colorSchemes = {
    DEFAULT: {
      label: "Standard-Farbschema",
      ranges: [{
        min: 0,
        max: 5,
        color: "#f0f8ff"
      }, {
        min: 5,
        max: 10,
        color: "#d9e2eb"
      }, {
        min: 10,
        max: 15,
        color: "#c3ccd7"
      }, {
        min: 15,
        max: 20,
        color: "#aeb7c3"
      }, {
        min: 20,
        max: 35,
        color: "#99a2b0"
      }, {
        min: 35,
        max: 50,
        color: "#868e9d"
      }, {
        min: 50,
        max: 100,
        color: "#737a8a"
      }, {
        min: 100,
        max: 150,
        color: "#606678"
      }, {
        min: 150,
        max: 200,
        color: "#4f5366"
      }, {
        min: 200,
        max: 300,
        color: "#3e4155"
      }, {
        min: 300,
        max: 600,
        color: "#2e3044"
      }, {
        min: 600,
        max: Infinity,
        color: "#1f1f33"
      }]
    },
    PURPLEGREENYELLOW: {
      label: "Lila-Grün-Gelb",
      ranges: [{
        min: 0,
        max: 5,
        color: "#441155"
      }, {
        min: 5,
        max: 10,
        color: "#341264"
      }, {
        min: 10,
        max: 15,
        color: "#1a1374"
      }, {
        min: 15,
        max: 20,
        color: "#133283"
      }, {
        min: 20,
        max: 35,
        color: "#136193"
      }, {
        min: 35,
        max: 50,
        color: "#129ca2"
      }, {
        min: 50,
        max: 100,
        color: "#10b282"
      }, {
        min: 100,
        max: 150,
        color: "#0ec14f"
      }, {
        min: 150,
        max: 200,
        color: "#0bd110"
      }, {
        min: 200,
        max: 300,
        color: "#4de008"
      }, {
        min: 300,
        max: 600,
        color: "#9ff004"
      }, {
        min: 600,
        max: Infinity,
        color: "#ffff00"
      }]
    },
    TEAL: {
      label: "Farbschema Türkis",
      ranges: [{
        min: 0,
        max: 5,
        color: "#6eeefa"
      }, {
        min: 5,
        max: 35,
        color: "#63d4e2"
      }, {
        min: 35,
        max: 50,
        color: "#58bbca"
      }, {
        min: 50,
        max: 100,
        color: "#4da2b3"
      }, {
        min: 100,
        max: 150,
        color: "#428b9c"
      }, {
        min: 150,
        max: 200,
        color: "#387386"
      }, {
        min: 200,
        max: 300,
        color: "#2d5d71"
      }, {
        min: 300,
        max: 400,
        color: "#23475c"
      }, {
        min: 400,
        max: Infinity,
        color: "#193348"
      }]
    },
    RKIHEATMAP: {
      label: "RKI-Heatmap",
      ranges: [{
        min: 0,
        max: 5,
        color: "#d0d1e6"
      }, {
        min: 5,
        max: 10,
        color: "#a6bedb"
      }, {
        min: 10,
        max: 15,
        color: "#7cacd1"
      }, {
        min: 15,
        max: 20,
        color: "#a6c883"
      }, {
        min: 20,
        max: 35,
        color: "#e5ef25"
      }, {
        min: 35,
        max: 50,
        color: "#ffe600"
      }, {
        min: 50,
        max: 100,
        color: "#ffbd00"
      }, {
        min: 100,
        max: 150,
        color: "#ff8700"
      }, {
        min: 150,
        max: 200,
        color: "#ff3c00"
      }, {
        min: 200,
        max: 300,
        color: "#f40000"
      }, {
        min: 300,
        max: 600,
        color: "#bf0000"
      }, {
        min: 600,
        max: Infinity,
        color: "#8b0000"
      }]
    }
  };
  var selectedColorScheme, selectedTimeframe;
  var matrixChartConfig = {
    type: "matrix",
    data: {
      datasets: [{
        label: "",
        data: [],
        borderColor: "#000",
        borderWidth: function borderWidth(ctx) {
          if (ctx.raw.y === "total") {
            return {
              top: 4,
              left: 0,
              right: 0,
              bottom: 0
            };
          }

          return 0;
        },
        backgroundColor: function backgroundColor(ctx) {
          var colorScheme = selectedColorScheme || "DEFAULT";
          var value = ctx.dataset.data[ctx.dataIndex].v;
          var color = colorSchemes[colorScheme].ranges[0].color;
          colorSchemes[colorScheme].ranges.forEach(function (range) {
            if (value > range.min && value <= range.max) {
              color = range.color;
            }
          });
          return color;
        },
        height: function height(context) {
          var a = context.chart.chartArea;

          if (!a) {
            return 0;
          }

          return (a.bottom - a.top) / ageGroups.length + 1;
        },
        width: function width(context) {
          var a = context.chart.chartArea;

          if (!a) {
            return 0;
          }

          return (a.right - a.left) / numberOfDays + 1;
        }
      }]
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
            title: function title() {
              return "";
            },
            label: function label(ctx) {
              var v = ctx.dataset.data[ctx.dataIndex];
              return ["".concat(formatDate(v.x)), "Inzidenz: ".concat(v.v.toString().replace(".", ",")), "F\xE4lle heute: ".concat(v.d.toString().replace(".", ",")), "F\xE4lle letzte 7 Tage: ".concat(v.w.toString().replace(".", ","))];
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
              size: 12,
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
        "y-1": {
          display: true,
          type: "category",
          position: "left",
          title: {
            color: "#333",
            display: true,
            text: "Alter in Jahren",
            font: {
              size: 14,
              family: "Monospace"
            }
          },
          offset: true,
          labels: ageGroups,
          ticks: {
            display: true,
            callback: function callback(value, index, values) {
              return ageGroupsLabels[value];
            },
            font: {
              size: 12,
              family: "Monospace"
            },
            color: "#333",
            padding: 5,
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
        },
        "y-2": {
          display: true,
          type: "category",
          position: "right",
          offset: true,
          labels: ageGroups,
          ticks: {
            display: true,
            callback: function callback(value, index, values) {
              return ageGroupsLabels[value];
            },
            font: {
              size: 12,
              family: "Monospace"
            },
            color: "#333",
            padding: 5,
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
  var matrixChartConfigV2 = {
    type: "matrix",
    data: {
      datasets: [{
        label: "",
        data: [],
        borderColor: "#000",
        borderWidth: function borderWidth(ctx) {
          if (ctx.raw.y === "total") {
            return {
              top: 4,
              left: 0,
              right: 0,
              bottom: 0
            };
          }

          return 0;
        },
        backgroundColor: function backgroundColor(ctx) {
          var colorScheme = selectedColorScheme || "DEFAULT";
          var value = ctx.dataset.data[ctx.dataIndex].v;
          var color = colorSchemes[colorScheme].ranges[0].color;
          colorSchemes[colorScheme].ranges.forEach(function (range) {
            if (value > range.min && value <= range.max) {
              color = range.color;
            }
          });
          return color;
        },
        height: function height(context) {
          var a = context.chart.chartArea;

          if (!a) {
            return 0;
          }

          return (a.bottom - a.top) / ageGroupsV2.length + 1;
        },
        width: function width(context) {
          var a = context.chart.chartArea;

          if (!a) {
            return 0;
          }

          return (a.right - a.left) / numberOfDays + 1;
        }
      }]
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
            title: function title() {
              return "";
            },
            label: function label(ctx) {
              var v = ctx.dataset.data[ctx.dataIndex];
              return ["".concat(v.x, " (").concat(moment(v.first).format("D.M.YY"), "\u2013").concat(moment(v.last).format("D.M.YY"), ")"), "Inzidenz: ".concat(v.v.toString().replace(".", ",")), "neue F\xE4lle: ".concat(v.c), "Altersgruppe: ".concat(ageGroupsLabelsV2[ageGroupsV2.indexOf(v.y)]), "Bev\xF6lkerung: ".concat(v.p)];
            }
          }
        },
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          type: "category",
          offset: true,
          title: {
            color: "#333",
            display: true,
            text: "Kalenderwoche",
            font: {
              size: 14,
              family: "Monospace"
            },
            padding: {
              top: 5
            }
          },
          ticks: {
            font: {
              size: 12,
              family: "Monospace"
            },
            color: "#333",
            maxRotation: 90,
            minRotation: 90,
            autoSkip: true,
            beginAtZero: true
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
        "y-1": {
          display: true,
          type: "category",
          position: "left",
          title: {
            color: "#333",
            display: true,
            text: "Alter in Jahren",
            font: {
              size: 14,
              family: "Monospace"
            }
          },
          offset: true,
          labels: ageGroupsV2,
          ticks: {
            display: true,
            callback: function callback(value, index, values) {
              return ageGroupsLabelsV2[value];
            },
            font: {
              size: 12,
              family: "Monospace"
            },
            color: "#333",
            padding: 5,
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
        },
        "y-2": {
          display: true,
          type: "category",
          position: "right",
          offset: true,
          labels: ageGroupsV2,
          ticks: {
            display: true,
            callback: function callback(value, index, values) {
              return ageGroupsLabelsV2[value];
            },
            font: {
              size: 12,
              family: "Monospace"
            },
            color: "#333",
            padding: 5,
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

    if (selectObject) {
      for (var _i = 0, _Object$entries = Object.entries(selectObject.target.options); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            key = _Object$entries$_i[0],
            option = _Object$entries$_i[1];

        if (option.selected && option.value && option.value.length === 5) {
          selectedLandkreise.push(option.value);
        }
      }
    } else {
      document.getElementById("landkreisSelect").dispatchEvent(new Event("change"));
    }
  }

  function colorSchemeSelectOnChange(eventObject) {
    if (eventObject) {
      selectedColorScheme = eventObject.target.value;
    } else {
      document.querySelectorAll("input[name=colorscheme]").forEach(function (input) {
        if (input.checked) {
          input.dispatchEvent(new Event("change"));
        }
      });
    }
  }

  function colorschemeSet(id) {
    switch (id) {
      case "lgg":
      case "3":
        id = 'PURPLEGREENYELLOW';
        break;

      case "rki":
      case "2":
        id = 'RKIHEATMAP';
        break;

      default:
        id = 'DEFAULT';
    }

    document.querySelectorAll("input[name=colorscheme]").forEach(function (input) {
      if (input.value === id && !input.disabled) {
        input.checked = true;
      } else {
        input.checked = false;
      }
    });
  }

  function colorschemeGetForUrl() {
    switch (selectedColorScheme) {
      case "PURPLEGREENYELLOW":
        return "3";

      case "RKIHEATMAP":
        return "2";

      default:
        return "1";
    }
  }

  function heatmapversionStatusOnChange(eventObject) {
    if (eventObject) {
      useV2 = eventObject.target.value === "v2";
    } else {
      document.querySelectorAll("input[name=heatmapversion]").forEach(function (input) {
        if (input.checked) {
          input.dispatchEvent(new Event("change"));
        }
      });
    }

    if (useV2) {
      document.getElementById("btnradio1").checked = true;
      document.getElementById("btnradio1").dispatchEvent(new Event("change"));
      document.getElementById("btnradio2").disabled = true;
      document.getElementById("btnradio3").disabled = true;
      document.getElementById("btnradio4").disabled = true;
    } else {
      document.getElementById("btnradio2").disabled = false;
      document.getElementById("btnradio3").disabled = false;
      document.getElementById("btnradio4").disabled = false;
    }
  }

  function heatmapversionSet(id) {
    switch (id) {
      case "v2":
      case "2":
        id = 'v2';
        break;

      default:
        id = 'v1';
    }

    document.querySelectorAll("input[name=heatmapversion]").forEach(function (input) {
      if (input.value === id && !input.disabled) {
        input.checked = true;
      } else {
        input.checked = false;
      }
    });
  }

  function updateLegend(landkreisId) {
    document.getElementById("legendContainer").innerHTML = '';
    var element = document.createElement("div");
    element.setAttribute("class", "d-xl-flex justify-content-between");
    var paragraph = document.createElement("p");
    paragraph.setAttribute("class", "text-muted small");
    paragraph.innerText = "Maus über / Finger auf eine Kachel für Details.";
    element.appendChild(paragraph);
    paragraph = document.createElement("p");
    paragraph.setAttribute("class", "text-muted small");
    paragraph.innerHTML = "URL f\xFCr diese Ansicht: <a href=\"".concat(getCurrentUrl(landkreisId), "\">").concat(getCurrentUrl(landkreisId), "</a>");
    element.appendChild(paragraph);
    document.getElementById("legendContainer").appendChild(element);
    element = document.createElement("dl");
    element.setAttribute("class", "row text-muted");

    if (useV2) {
      element.innerHTML = "<dt class=\"col-xl-3\">Farbschema</dt><dd class=\"col-xl-9\">gemeldete COVID-19-F\xE4lle in der Kalenderwoche pro 100.000 Personen in der Altersgruppe (7-Tage-Inzidenz). Inzidenzen der aktuellen Kalenderwoche sind niedriger und enthalten Unsicherheiten. Ab Mitte der Woche k\xF6nnen Tendenzen sichtbar werden.</dd>";
    } else {
      element.innerHTML = "<dt class=\"col-xl-3\">Farbschema</dt><dd class=\"col-xl-9\">gemeldete COVID-19-F\xE4lle der letzten 7 Tage pro 100.000 Personen in der Altersgruppe (7-Tage-Inzidenz). Tage ohne Daten werden in der Kategorie \u201E0\u20135\u201C dargestellt.</dd>";
    }

    document.getElementById("legendContainer").appendChild(element);
    var ul = document.createElement("ul");
    ul.setAttribute("class", "list-inline row");
    colorSchemes[selectedColorScheme].ranges.forEach(function (range) {
      var li = document.createElement("li");
      li.setAttribute("class", "list-inline-item col-lg-2 col-md-3 col-sm-4 col-6");
      var legendString = "".concat(range.min === 0 ? "" : ">", "&#8201;").concat(range.min).concat(isFinite(range.max) ? "&#8239;&#8211;&#8201;" + range.max : "");
      li.innerHTML = "<span style=\"background-color:".concat(range.color, ";height:16px;width:16px;margin-right:8px;display:inline-block\"></span><span style=\"vertical-align:text-bottom\">").concat(legendString, "</span>");
      ul.appendChild(li);
    });
    document.getElementById("legendContainer").appendChild(ul);
    element = document.createElement("dl");
    element.setAttribute("class", "row text-muted");
    element.innerHTML = "<dt class=\"col-xl-3\">X-Achse</dt><dd class=\"col-xl-9\">zeitlicher Verlauf</dd><dt class=\"col-xl-3\">Y-Achse</dt><dd class=\"col-xl-9\">Altersgruppen und Gesamtbev\xF6lkerung, Stand: 31.12.2019.</dd>";
    document.getElementById("legendContainer").appendChild(element);
    paragraph = document.createElement("p");
    paragraph.setAttribute("class", "text-muted");
    var link = document.createElement("a");

    if (useV2) {
      link.setAttribute("href", "https://github.com/tschach/covaltvis/blob/main/data/v2/".concat(landkreisId, "v2.json"));
    } else {
      link.setAttribute("href", "https://github.com/tschach/covaltvis/blob/main/data/".concat(landkreisId, ".json"));
    }

    link.innerText = "Datensatz auf Github";
    paragraph.appendChild(link);
    document.getElementById("legendContainer").appendChild(paragraph);
  }

  function updateTimeframeRadioOnChange(eventObject) {
    if (eventObject) {
      selectedTimeframe = eventObject.target.value;
      var now = new Date();

      switch (selectedTimeframe) {
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

        default:
          fromDate = null;
          matrixChartConfig.options.scales.x.time.unit = "week";
      }
    } else {
      document.querySelectorAll("input[name=timeframe]").forEach(function (input) {
        if (input.checked) {
          input.dispatchEvent(new Event("change"));
        }
      });
    }
  }

  function timeframeSet(id) {
    switch (id) {
      case "last28d":
      case "4":
        id = 'last28d';
        break;

      case "jan2021":
      case "3":
        id = 'jan2021';
        break;

      case "oct2020":
      case "2":
        id = 'oct2020';
        break;

      default:
        id = 'all';
    }

    document.querySelectorAll("input[name=timeframe]").forEach(function (input) {
      if (input.value === id && !input.disabled) {
        input.checked = true;
      } else {
        input.checked = false;
      }
    });
  }

  function timeframeGetForUrl() {
    switch (selectedTimeframe) {
      case "last28d":
        return "4";

      case "jan2021":
        return "3";

      case "oct2020":
        return "2";

      default:
        return "1";
    }
  }

  function updateChartsButtonOnChange() {
    updateCharts(fromDate, toDate);
  }

  function getLandkreisData(landkreisId, useV2) {
    var path;

    if (useV2) {
      path = "data/v2/".concat(landkreisId, "v2.json");
    } else {
      path = "data/".concat(landkreisId, ".json");
    }

    return axios.get(path);
  }

  var formatDate = function formatDate(date) {
    if (!moment.isDate(date)) {
      date = new Date(date);
    }

    return "".concat(date.getDate(), ". ").concat(date.toLocaleString("de-DE", {
      month: "long"
    }), " ").concat(date.getFullYear());
  };

  function formatDate2(date) {
    return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
  }

  function initMatrixChart(landkreisId) {
    var canvasId = "matrixChartCanvas".concat(landkreisId);
    var canvasElement = document.createElement("canvas");
    canvasElement.setAttribute("id", canvasId);

    if (useV2) {
      canvasElement.setAttribute("style", "width:100%;height:40vw;max-height:450px;min-height:300px;");
    } else {
      canvasElement.setAttribute("style", "width:100%;height:33vw;max-height:400px;min-height:250px;");
    }

    document.getElementById("canvasContainer").appendChild(canvasElement);
    return canvasId;
  }

  function getCurrentUrl(ags) {
    if (devMode === true) {
      return "http://127.0.0.1:8080/#".concat(ags, "/").concat(useV2 ? 'v2' : 'v1', "/").concat(timeframeGetForUrl(), "/").concat(colorschemeGetForUrl());
    }

    return "https://tschach.github.io/covaltvis/#".concat(ags, "/").concat(useV2 ? 'v2' : 'v1', "/").concat(timeframeGetForUrl(), "/").concat(colorschemeGetForUrl());
  }

  function updateCharts(fromDate, toDate) {
    fromDate = fromDate || "2020-01-27";
    toDate = toDate || "2050-12-31";
    document.getElementById("canvasContainer").innerHTML = '';
    numberOfDays = 0;
    selectedLandkreise.forEach(function (landkreisId) {
      var canvasId = initMatrixChart(landkreisId);
      ctx = document.getElementById(canvasId).getContext("2d");
      getLandkreisData(landkreisId, useV2).then(function (response) {
        if (response.data) {
          (function () {
            var dataset = [];
            var lastDate;

            if (useV2) {
              var _loop = function _loop() {
                var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
                    key = _Object$entries2$_i[0],
                    value = _Object$entries2$_i[1];

                if (value.incidenceByAgegroup) {
                  ageGroupsV2.forEach(function (ageGroup) {
                    var cases = 0;
                    cases = value.incidenceByAgegroup[ageGroup];

                    if (ageGroup !== "total") {
                      dataset.push({
                        x: value.label,
                        y: ageGroup,
                        v: cases,
                        first: value.first,
                        last: value.last,
                        c: value.newCasesByAgegroup[ageGroup],
                        p: response.data.populations[ageGroup]
                      });
                    }
                  });
                  dataset.push({
                    x: value.label,
                    y: "total",
                    v: value.incidence,
                    first: value.first,
                    last: value.last,
                    c: value.newCases,
                    p: response.data.populations.total
                  });
                }
              };

              for (var _i2 = 0, _Object$entries2 = Object.entries(response.data.byWeek); _i2 < _Object$entries2.length; _i2++) {
                _loop();
              }

              matrixChartConfigV2.data.datasets[0].data = dataset;
              numberOfDays = dataset.length / ageGroupsV2.length;
              var titleElement = document.createElement("h2");
              titleElement.setAttribute("class", "offset-xl-1 col-xl-10 lead");
              titleElement.innerText = textLabels.matrixChartTitle(landkreise[landkreisId].name, formatDate(new Date(response.data.lastCaseDate)));
              var child;
              var titleContainer = document.getElementById("titleContainer");

              while (child = titleContainer.firstChild) {
                child.remove();
              }

              titleContainer.appendChild(titleElement);

              try {
                matrixChart.destroy();
              } catch (e) {} finally {
                matrixChart = new Chart(ctx, matrixChartConfigV2);
              }

              updateLegend(landkreisId);
              document.getElementById("resultsContainer").scrollIntoView(true);
            } else {
              var _loop2 = function _loop2() {
                var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
                    key = _Object$entries3$_i[0],
                    value = _Object$entries3$_i[1];

                ageGroups.forEach(function (ageGroup) {
                  if (key >= fromDate && key <= toDate) {
                    var cases = 0;

                    if (value.hasOwnProperty("".concat(ageGroup, "_7day_cases_per_100k"))) {
                      cases = value["".concat(ageGroup, "_7day_cases_per_100k")];
                    }

                    var dailyCases = "-";

                    if (value.hasOwnProperty("".concat(ageGroup, "_cases"))) {
                      dailyCases = value["".concat(ageGroup, "_cases")];
                    }

                    var weeklyCases = "-";

                    if (value.hasOwnProperty("".concat(ageGroup, "_7day_cases"))) {
                      weeklyCases = value["".concat(ageGroup, "_7day_cases")];
                    }

                    dataset.push({
                      x: key,
                      y: ageGroup,
                      v: cases,
                      d: dailyCases,
                      w: weeklyCases
                    });
                  }
                });
                lastDate = key;
              };

              for (var _i3 = 0, _Object$entries3 = Object.entries(response.data); _i3 < _Object$entries3.length; _i3++) {
                _loop2();
              }

              matrixChartConfig.data.datasets[0].data = dataset;
              numberOfDays = dataset.length / ageGroups.length;

              var _titleElement = document.createElement("h2");

              _titleElement.setAttribute("class", "offset-xl-1 col-xl-10 lead");

              _titleElement.innerText = textLabels.matrixChartTitle(landkreise[landkreisId].name, formatDate(new Date(lastDate)));

              var _child;

              var _titleContainer = document.getElementById("titleContainer");

              while (_child = _titleContainer.firstChild) {
                _child.remove();
              }

              _titleContainer.appendChild(_titleElement);

              try {
                matrixChart.destroy();
              } catch (e) {} finally {
                matrixChart = new Chart(ctx, matrixChartConfig);
              }

              updateLegend(landkreisId);
              document.getElementById("resultsContainer").scrollIntoView(true);
            }
          })();
        }
      })["catch"](function (error) {
        console.log(error);
      }).then(function () {// always executed
      });
    });
  }

  document.getElementById("landkreisSelect").addEventListener("change", function (event) {
    return landkreisSelectOnChange(event);
  });
  document.getElementById("updateChartsButton").addEventListener("click", updateChartsButtonOnChange);
  document.querySelectorAll("input[name=colorscheme]").forEach(function (input) {
    input.addEventListener("change", function (event) {
      return colorSchemeSelectOnChange(event);
    });
  });
  document.querySelectorAll("input[name=timeframe]").forEach(function (input) {
    input.addEventListener("change", function (event) {
      return updateTimeframeRadioOnChange(event);
    });
  });
  document.querySelectorAll("input[name=heatmapversion]").forEach(function (input) {
    input.addEventListener("change", function (event) {
      return heatmapversionStatusOnChange(event);
    });
  });
  document.addEventListener("DOMContentLoaded", function (event) {
    moment.locale("de-DE");
    var parameters = window.location.hash.substr(1);

    if (parameters) {
      parameters = parameters.split("/");
    }

    if (parameters && parameters[1]) {
      heatmapversionSet(parameters[1]);
    }

    if (parameters && parameters[2]) {
      timeframeSet(parameters[2]);
    }

    if (parameters && parameters[3]) {
      colorschemeSet(parameters[3]);
    }

    heatmapversionStatusOnChange();
    colorSchemeSelectOnChange();
    updateTimeframeRadioOnChange();
    axios.get("data/landkreise.json").then(function (response) {
      if (response.data) {
        landkreise = {};
        Object.keys(response.data).sort(function (a, b) {
          if (response.data[a].sorting > response.data[b].sorting) return 1;else if (response.data[a].sorting < response.data[b].sorting) return -1;else return 0;
        }).forEach(function (key) {
          var value = response.data[key];
          var agsPadded = ("0000" + key).slice(-5);
          landkreise[agsPadded] = value;
          var optionElement = document.createElement("option");
          optionElement.setAttribute("value", agsPadded);
          optionElement.innerText = "".concat(value.name);
          optionElement.selected = parameters && parameters[0] === agsPadded;
          document.getElementById("landkreisSelect").appendChild(optionElement);
        });
        document.getElementById("landkreisSelect").disabled = false;
        landkreisSelectOnChange();
        var x = document.getElementById("landkreisSelect").validity.valid;

        if (x === true) {
          document.getElementById("updateChartsButton").dispatchEvent(new Event("click"));
        }

        if (devMode === true && !parameters[0]) {
          selectedLandkreise = [Object.keys(landkreise)[0]];
          updateCharts();
        }
      }
    });
  });
})();