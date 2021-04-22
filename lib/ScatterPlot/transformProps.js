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
    encoding,
    margin,
    theme
  } = formData;
  const {
    data
  } = queryData;
  const hooks = chartProps.hooks;
  const fieldsFromHooks = ['TooltipRenderer', 'LegendRenderer', 'LegendGroupRenderer', 'LegendItemRenderer', 'LegendItemMarkRenderer', 'LegendItemLabelRenderer'];
  return {
    data,
    width,
    height,
    encoding,
    margin,
    theme,
    ...(0, _lodash.pick)(hooks, fieldsFromHooks)
  };
}