"use strict";

exports.__esModule = true;
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _xyChart = require("@data-ui/xy-chart");

var _theme = require("@data-ui/theme");

var _core = require("@superset-ui/core");

var _encodable = require("encodable");

var _DefaultTooltipRenderer = _interopRequireDefault(require("./DefaultTooltipRenderer"));

var _Encoder = require("./Encoder");

var _createMarginSelector = _interopRequireWildcard(require("../../utils/createMarginSelector"));

var _convertScaleToDataUIScaleShape = _interopRequireDefault(require("../../utils/convertScaleToDataUIScaleShape"));

var _createXYChartLayoutWithTheme = _interopRequireDefault(require("../../utils/createXYChartLayoutWithTheme"));

var _createRenderLegend = _interopRequireDefault(require("../legend/createRenderLegend"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultProps = {
  className: '',
  margin: _createMarginSelector.DEFAULT_MARGIN,
  encoding: {},
  theme: _theme.chartTheme,
  TooltipRenderer: _DefaultTooltipRenderer.default
};

class BoxPlot extends _react.default.PureComponent {
  constructor(...args) {
    super(...args);
    this.createEncoder = _Encoder.boxPlotEncoderFactory.createSelector();
    this.createMargin = (0, _createMarginSelector.default)();

    this.renderChart = dim => {
      const {
        width,
        height
      } = dim;
      const {
        data,
        margin,
        theme,
        TooltipRenderer,
        encoding
      } = this.props;
      const encoder = this.createEncoder(encoding);
      const {
        channels
      } = encoder;
      const isHorizontal = (0, _encodable.isFieldDef)(channels.y.definition) && channels.y.definition.type === 'nominal';
      encoder.setDomainFromDataset(data);
      const layout = (0, _createXYChartLayoutWithTheme.default)({
        width,
        height,
        margin: this.createMargin(margin),
        theme,
        xEncoder: channels.x,
        yEncoder: channels.y
      });
      return layout.renderChartWithFrame(chartDim => /*#__PURE__*/_react.default.createElement(_xyChart.XYChart, {
        showYGrid: true,
        width: chartDim.width,
        height: chartDim.height,
        ariaLabel: "BoxPlot",
        margin: layout.margin,
        renderTooltip: ({
          datum,
          color
        }) => /*#__PURE__*/_react.default.createElement(TooltipRenderer, {
          datum: datum,
          color: color,
          encoder: encoder
        }),
        theme: theme // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ,
        xScale: (0, _convertScaleToDataUIScaleShape.default)(channels.x.definition.scale) // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ,
        yScale: (0, _convertScaleToDataUIScaleShape.default)(channels.y.definition.scale)
      }, layout.renderXAxis(), layout.renderYAxis(), /*#__PURE__*/_react.default.createElement(_xyChart.BoxPlotSeries, {
        key: (0, _encodable.isFieldDef)(channels.x.definition) ? channels.x.definition.field : '',
        animated: true,
        data: isHorizontal ? data.map(row => ({ ...row,
          y: channels.y.getValueFromDatum(row)
        })) : data.map(row => ({ ...row,
          x: channels.x.getValueFromDatum(row)
        })),
        fill: datum => channels.color.encodeDatum(datum, '#55acee'),
        fillOpacity: 0.4,
        stroke: datum => channels.color.encodeDatum(datum),
        strokeWidth: 1,
        widthRatio: 0.6,
        horizontal: isHorizontal
      })));
    };
  }

  render() {
    const {
      className,
      data,
      encoding,
      width,
      height
    } = this.props;
    return /*#__PURE__*/_react.default.createElement(_core.WithLegend, {
      className: `superset-chart-box-plot ${className}`,
      width: width,
      height: height,
      position: "top",
      renderLegend: (0, _createRenderLegend.default)(this.createEncoder(encoding), data, this.props),
      renderChart: this.renderChart
    });
  }

}

exports.default = BoxPlot;
BoxPlot.propTypes = {
  className: _propTypes.default.string,
  width: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]).isRequired,
  height: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]).isRequired,
  TooltipRenderer: _propTypes.default.elementType
};
BoxPlot.defaultProps = defaultProps;