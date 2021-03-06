"use strict";

exports.__esModule = true;
exports.default = transformProps;

var _lodash = require("lodash");

function transformProps(chartProps) {
  const {
    width,
    height,
    formData,
    queryData
  } = chartProps;
  const {
    colorScheme,
    xAxisLabel,
    xAxisFormat,
    yAxisLabel,
    yAxisFormat
  } = formData;
  const data = queryData.data;
  return {
    data: (0, _lodash.flatMap)(data.map(row => row.values.map(v => ({ ...v,
      name: row.key[0]
    })))),
    width,
    height,
    encoding: {
      x: {
        field: 'x',
        type: 'temporal',
        format: xAxisFormat,
        scale: {
          type: 'time'
        },
        axis: {
          orient: 'bottom',
          title: xAxisLabel
        }
      },
      y: {
        field: 'y',
        type: 'quantitative',
        format: yAxisFormat,
        scale: {
          type: 'linear'
        },
        axis: {
          orient: 'left',
          title: yAxisLabel
        }
      },
      stroke: {
        field: 'name',
        type: 'nominal',
        scale: {
          scheme: colorScheme
        },
        legend: true
      }
    }
  };
}