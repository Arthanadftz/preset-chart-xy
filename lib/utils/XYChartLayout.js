"use strict";

exports.__esModule = true;
exports.default = exports.DEFAULT_LABEL_ANGLE = void 0;

var _react = _interopRequireDefault(require("react"));

var _xyChart = require("@data-ui/xy-chart");

var _core = require("@superset-ui/core");

var _createTickComponent = _interopRequireDefault(require("./createTickComponent"));

var _computeAxisLayout = _interopRequireDefault(require("./computeAxisLayout"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const DEFAULT_LABEL_ANGLE = 40; // Additional margin to avoid content hidden behind scroll bar

exports.DEFAULT_LABEL_ANGLE = DEFAULT_LABEL_ANGLE;
const OVERFLOW_MARGIN = 8;

class XYChartLayout {
  constructor(config) {
    const {
      width,
      height,
      minContentWidth = 0,
      minContentHeight = 0,
      margin,
      xEncoder,
      xTickSize,
      xTickTextStyle,
      autoAdjustXMargin = true,
      yEncoder,
      yTickSize,
      yTickTextStyle,
      autoAdjustYMargin = true
    } = config;
    this.xEncoder = xEncoder;
    this.yEncoder = yEncoder;

    if (typeof yEncoder.axis !== 'undefined') {
      this.yLayout = (0, _computeAxisLayout.default)(yEncoder.axis, {
        axisWidth: Math.max(height - margin.top - margin.bottom),
        defaultTickSize: yTickSize,
        tickTextStyle: yTickTextStyle
      });
    }

    const secondMargin = this.yLayout && autoAdjustYMargin ? (0, _core.mergeMargin)(margin, this.yLayout.minMargin) : margin;
    const innerWidth = Math.max(width - secondMargin.left - secondMargin.right, minContentWidth);

    if (typeof xEncoder.axis !== 'undefined') {
      this.xLayout = (0, _computeAxisLayout.default)(xEncoder.axis, {
        axisWidth: innerWidth,
        defaultTickSize: xTickSize,
        tickTextStyle: xTickTextStyle
      });
    }

    const finalMargin = this.xLayout && autoAdjustXMargin ? (0, _core.mergeMargin)(secondMargin, this.xLayout.minMargin) : secondMargin;
    const innerHeight = Math.max(height - finalMargin.top - finalMargin.bottom, minContentHeight);
    const chartWidth = Math.round(innerWidth + finalMargin.left + finalMargin.right);
    const chartHeight = Math.round(innerHeight + finalMargin.top + finalMargin.bottom);
    const isOverFlowX = chartWidth > width;
    const isOverFlowY = chartHeight > height;

    if (isOverFlowX) {
      finalMargin.bottom += OVERFLOW_MARGIN;
    }

    if (isOverFlowY) {
      finalMargin.right += OVERFLOW_MARGIN;
    }

    this.chartWidth = isOverFlowX ? chartWidth + OVERFLOW_MARGIN : chartWidth;
    this.chartHeight = isOverFlowY ? chartHeight + OVERFLOW_MARGIN : chartHeight;
    this.containerWidth = width;
    this.containerHeight = height;
    this.margin = finalMargin;
  }

  renderChartWithFrame(renderChart) {
    return /*#__PURE__*/_react.default.createElement(_core.ChartFrame, {
      width: this.containerWidth,
      height: this.containerHeight,
      contentWidth: this.chartWidth,
      contentHeight: this.chartHeight,
      renderContent: renderChart
    });
  }

  renderXAxis(props) {
    const {
      axis
    } = this.xEncoder;
    return axis && this.xLayout ? /*#__PURE__*/_react.default.createElement(_xyChart.XAxis, _extends({
      label: axis.getTitle(),
      labelOffset: this.xLayout.labelOffset,
      numTicks: axis.config.tickCount,
      orientation: axis.config.orient,
      tickComponent: (0, _createTickComponent.default)(this.xLayout),
      tickFormat: axis.formatValue
    }, props)) : null;
  }

  renderYAxis(props) {
    const {
      axis
    } = this.yEncoder;
    return axis && this.yLayout ? /*#__PURE__*/_react.default.createElement(_xyChart.YAxis, _extends({
      label: axis.getTitle(),
      labelOffset: this.yLayout.labelOffset,
      numTicks: axis.config.tickCount,
      orientation: axis.config.orient,
      tickFormat: axis.formatValue
    }, props)) : null;
  }

}

exports.default = XYChartLayout;