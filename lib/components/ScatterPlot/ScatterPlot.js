"use strict";

exports.__esModule = true;
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _xyChart = require("@data-ui/xy-chart");

var _theme = require("@data-ui/theme");

var _core = require("@superset-ui/core");

var _encodable = require("encodable");

var _Encoder = require("./Encoder");

var _createMarginSelector = _interopRequireWildcard(require("../../utils/createMarginSelector"));

var _DefaultTooltipRenderer = _interopRequireDefault(require("./DefaultTooltipRenderer"));

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

class ScatterPlot extends _react.PureComponent {
  constructor(...args) {
    super(...args);
    this.createEncoder = _Encoder.scatterPlotEncoderFactory.createSelector();
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
      encoder.setDomainFromDataset(data);
      const encodedData = data.map(d => ({
        x: channels.x.getValueFromDatum(d),
        y: channels.y.getValueFromDatum(d),
        ...d
      }));
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
        ariaLabel: "ScatterPlot",
        margin: layout.margin,
        renderTooltip: ({
          datum
        }) => /*#__PURE__*/_react.default.createElement(TooltipRenderer, {
          datum: datum,
          encoder: encoder
        }),
        theme: theme // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ,
        xScale: (0, _convertScaleToDataUIScaleShape.default)(channels.x.definition.scale) // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ,
        yScale: (0, _convertScaleToDataUIScaleShape.default)(channels.y.definition.scale)
      }, layout.renderXAxis(), layout.renderYAxis(), /*#__PURE__*/_react.default.createElement(_xyChart.PointSeries, {
        key: (0, _encodable.isFieldDef)(channels.x.definition) ? channels.x.definition.field : '',
        data: encodedData,
        fill: d => channels.fill.encodeDatum(d),
        fillOpacity: 0.5,
        stroke: d => channels.stroke.encodeDatum(d),
        size: d => channels.size.encodeDatum(d)
      })));
    };
  }

  render() {
    const {
      className,
      data,
      width,
      height,
      encoding
    } = this.props;
    return /*#__PURE__*/_react.default.createElement(_core.WithLegend, {
      className: `superset-chart-scatter-plot ${className}`,
      width: width,
      height: height,
      position: "top",
      renderLegend: (0, _createRenderLegend.default)(this.createEncoder(encoding), data, this.props),
      renderChart: this.renderChart
    });
  }

}

exports.default = ScatterPlot;
ScatterPlot.propTypes = {
  className: _propTypes.default.string,
  width: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]).isRequired,
  height: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]).isRequired,
  TooltipRenderer: _propTypes.default.elementType
};
ScatterPlot.defaultProps = defaultProps;