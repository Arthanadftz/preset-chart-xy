"use strict";

exports.__esModule = true;
exports.default = transformProps;

var _lodash = require("lodash");

function transformProps(chartProps) {
  const {
    width,
    height,
    queryData
  } = chartProps;
  const {
    data
  } = queryData;
  const formData = chartProps.formData;
  const hooks = chartProps.hooks;
  /**
   * Use type-check to make sure the field names are expected ones
   * and only pick these fields to pass to the chart.
   */

  const fieldsFromFormData = ['encoding', 'margin', 'theme'];
  const fieldsFromHooks = ['TooltipRenderer', 'LegendRenderer', 'LegendGroupRenderer', 'LegendItemRenderer', 'LegendItemMarkRenderer', 'LegendItemLabelRenderer'];
  return {
    data,
    width,
    height,
    ...(0, _lodash.pick)(formData, fieldsFromFormData),
    ...(0, _lodash.pick)(hooks, fieldsFromHooks)
  };
}