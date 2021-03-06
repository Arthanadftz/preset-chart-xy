"use strict";

exports.__esModule = true;
exports.default = DefaultTooltipRenderer;

var _react = _interopRequireDefault(require("react"));

var _core = require("@superset-ui/core");

var _encodable = require("encodable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DefaultTooltipRenderer({
  datum,
  encoder
}) {
  const {
    channels
  } = encoder;
  const {
    x,
    y,
    size,
    fill,
    stroke
  } = channels;
  const tooltipRows = [{
    key: 'x',
    keyColumn: x.getTitle(),
    valueColumn: x.formatDatum(datum)
  }, {
    key: 'y',
    keyColumn: y.getTitle(),
    valueColumn: y.formatDatum(datum)
  }];

  if ((0, _encodable.isFieldDef)(fill.definition)) {
    tooltipRows.push({
      key: 'fill',
      keyColumn: fill.getTitle(),
      valueColumn: fill.formatDatum(datum)
    });
  }

  if ((0, _encodable.isFieldDef)(stroke.definition)) {
    tooltipRows.push({
      key: 'stroke',
      keyColumn: stroke.getTitle(),
      valueColumn: stroke.formatDatum(datum)
    });
  }

  if ((0, _encodable.isFieldDef)(size.definition)) {
    tooltipRows.push({
      key: 'size',
      keyColumn: size.getTitle(),
      valueColumn: size.formatDatum(datum)
    });
  }

  channels.group.forEach(g => {
    tooltipRows.push({
      key: `${g.name}`,
      keyColumn: g.getTitle(),
      valueColumn: g.formatDatum(datum)
    });
  });
  channels.tooltip.forEach(g => {
    tooltipRows.push({
      key: `${g.name}`,
      keyColumn: g.getTitle(),
      valueColumn: g.formatDatum(datum)
    });
  });
  return /*#__PURE__*/_react.default.createElement(_core.TooltipFrame, null, /*#__PURE__*/_react.default.createElement(_core.TooltipTable, {
    data: tooltipRows
  }));
}