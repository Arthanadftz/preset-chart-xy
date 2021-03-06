"use strict";

exports.__esModule = true;
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _lodash = require("lodash");

var _xyChart = require("@data-ui/xy-chart");

var _theme = require("@data-ui/theme");

var _core = require("@superset-ui/core");

var _reselect = require("reselect");

var _DefaultTooltipRenderer = _interopRequireDefault(require("./DefaultTooltipRenderer"));

var _createMarginSelector = _interopRequireWildcard(require("../../utils/createMarginSelector"));

var _convertScaleToDataUIScaleShape = _interopRequireDefault(require("../../utils/convertScaleToDataUIScaleShape"));

var _createXYChartLayoutWithTheme = _interopRequireDefault(require("../../utils/createXYChartLayoutWithTheme"));

var _createRenderLegend = _interopRequireDefault(require("../legend/createRenderLegend"));

var _Encoder = require("./Encoder");

var _DefaultLegendItemMarkRenderer = _interopRequireDefault(require("./DefaultLegendItemMarkRenderer"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultProps = {
  className: '',
  encoding: {},
  LegendItemMarkRenderer: _DefaultLegendItemMarkRenderer.default,
  margin: _createMarginSelector.DEFAULT_MARGIN,
  theme: _theme.chartTheme,
  TooltipRenderer: _DefaultTooltipRenderer.default
};
/** Part of formData that is needed for rendering logic in this file */

const CIRCLE_STYLE = {
  strokeWidth: 1.5
};

class LineChart extends _react.PureComponent {
  constructor(...args) {
    super(...args);
    this.createEncoder = _Encoder.lineEncoderFactory.createSelector();
    this.createAllSeries = (0, _reselect.createSelector)(input => input.encoder, input => input.data, (encoder, data) => {
      const {
        channels
      } = encoder;
      const fieldNames = encoder.getGroupBys();
      const groups = (0, _lodash.groupBy)(data, row => fieldNames.map(f => `${f}=${row[f]}`).join(','));
      const allSeries = (0, _lodash.values)(groups).map(seriesData => {
        const firstDatum = seriesData[0]; // eslint-disable-next-line @typescript-eslint/no-unsafe-return

        const key = fieldNames.map(f => firstDatum[f]).join(',');
        const series = {
          key: key.length === 0 ? channels.y.getTitle() : key,
          fill: channels.fill.encodeDatum(firstDatum, false),
          stroke: channels.stroke.encodeDatum(firstDatum, '#222'),
          strokeDasharray: channels.strokeDasharray.encodeDatum(firstDatum, ''),
          strokeWidth: channels.strokeWidth.encodeDatum(firstDatum, 1),
          values: []
        };
        series.values = seriesData.map(v => ({
          x: channels.x.getValueFromDatum(v),
          y: channels.y.getValueFromDatum(v),
          data: v,
          parent: series
        })).sort((a, b) => {
          const aTime = a.x instanceof Date ? a.x.getTime() : a.x;
          const bTime = b.x instanceof Date ? b.x.getTime() : b.x;
          return aTime - bTime;
        });
        return series;
      });
      return allSeries;
    });
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
      const allSeries = this.createAllSeries({
        encoder,
        data
      });
      const layout = (0, _createXYChartLayoutWithTheme.default)({
        width,
        height,
        margin: this.createMargin(margin),
        theme,
        xEncoder: channels.x,
        yEncoder: channels.y
      });
      return layout.renderChartWithFrame(chartDim => /*#__PURE__*/_react.default.createElement(_xyChart.WithTooltip, {
        renderTooltip: ({
          datum,
          series
        }) => /*#__PURE__*/_react.default.createElement(TooltipRenderer, {
          encoder: encoder,
          allSeries: allSeries,
          datum: datum,
          series: series,
          theme: theme
        })
      }, ({
        onMouseLeave,
        onMouseMove,
        tooltipData
      }) => /*#__PURE__*/_react.default.createElement(_xyChart.XYChart, {
        showYGrid: true,
        snapTooltipToDataX: true,
        width: chartDim.width,
        height: chartDim.height,
        ariaLabel: "LineChart",
        eventTrigger: "container",
        margin: layout.margin,
        renderTooltip: null,
        theme: theme,
        tooltipData: tooltipData // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ,
        xScale: (0, _convertScaleToDataUIScaleShape.default)(channels.x.definition.scale) // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ,
        yScale: (0, _convertScaleToDataUIScaleShape.default)(channels.y.definition.scale),
        onMouseMove: onMouseMove,
        onMouseLeave: onMouseLeave
      }, layout.renderXAxis(), layout.renderYAxis(), this.renderSeries(allSeries), /*#__PURE__*/_react.default.createElement(_xyChart.CrossHair, {
        fullHeight: true,
        showCircle: true,
        showMultipleCircles: true,
        strokeDasharray: "",
        showHorizontalLine: false,
        circleFill: d => d.y === tooltipData.datum.y ? d.parent.stroke : '#fff',
        circleSize: d => d.y === tooltipData.datum.y ? 6 : 4,
        circleStroke: d => d.y === tooltipData.datum.y ? '#fff' : d.parent.stroke,
        circleStyles: CIRCLE_STYLE,
        stroke: "#ccc"
      }))));
    };
  }

  // eslint-disable-next-line class-methods-use-this
  renderSeries(allSeries) {
    const filledSeries = (0, _lodash.flatMap)(allSeries.filter(({
      fill
    }) => fill).map(series => {
      const gradientId = (0, _lodash.uniqueId)((0, _lodash.kebabCase)(`gradient-${series.key}`));
      return [/*#__PURE__*/_react.default.createElement(_xyChart.LinearGradient, {
        key: `${series.key}-gradient`,
        id: gradientId,
        from: series.stroke,
        to: "#fff"
      }), /*#__PURE__*/_react.default.createElement(_xyChart.AreaSeries, {
        key: `${series.key}-fill`,
        seriesKey: series.key,
        data: series.values,
        interpolation: "linear",
        fill: `url(#${gradientId})`,
        stroke: series.stroke,
        strokeWidth: series.strokeWidth
      })];
    }));
    const unfilledSeries = allSeries.filter(({
      fill
    }) => !fill).map(series => /*#__PURE__*/_react.default.createElement(_xyChart.LineSeries, {
      key: series.key,
      seriesKey: series.key,
      interpolation: "linear",
      data: series.values,
      stroke: series.stroke,
      strokeDasharray: series.strokeDasharray,
      strokeWidth: series.strokeWidth
    }));
    return filledSeries.concat(unfilledSeries);
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
      className: `superset-chart-line ${className}`,
      width: width,
      height: height,
      position: "top",
      renderLegend: (0, _createRenderLegend.default)(this.createEncoder(encoding), data, this.props),
      renderChart: this.renderChart
    });
  }

}

exports.default = LineChart;
LineChart.propTypes = {
  className: _propTypes.default.string,
  width: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]).isRequired,
  height: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]).isRequired,
  TooltipRenderer: _propTypes.default.elementType,
  theme: _propTypes.default.any
};
LineChart.defaultProps = defaultProps;