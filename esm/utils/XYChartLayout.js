function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { XAxis, YAxis } from '@data-ui/xy-chart';
import { ChartFrame, mergeMargin } from '@superset-ui/core';
import createTickComponent from './createTickComponent';
import computeAxisLayout from './computeAxisLayout';
export const DEFAULT_LABEL_ANGLE = 40; // Additional margin to avoid content hidden behind scroll bar

const OVERFLOW_MARGIN = 8;
export default class XYChartLayout {
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
      this.yLayout = computeAxisLayout(yEncoder.axis, {
        axisWidth: Math.max(height - margin.top - margin.bottom),
        defaultTickSize: yTickSize,
        tickTextStyle: yTickTextStyle
      });
    }

    const secondMargin = this.yLayout && autoAdjustYMargin ? mergeMargin(margin, this.yLayout.minMargin) : margin;
    const innerWidth = Math.max(width - secondMargin.left - secondMargin.right, minContentWidth);

    if (typeof xEncoder.axis !== 'undefined') {
      this.xLayout = computeAxisLayout(xEncoder.axis, {
        axisWidth: innerWidth,
        defaultTickSize: xTickSize,
        tickTextStyle: xTickTextStyle
      });
    }

    const finalMargin = this.xLayout && autoAdjustXMargin ? mergeMargin(secondMargin, this.xLayout.minMargin) : secondMargin;
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
    return /*#__PURE__*/React.createElement(ChartFrame, {
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
    return axis && this.xLayout ? /*#__PURE__*/React.createElement(XAxis, _extends({
      label: axis.getTitle(),
      labelOffset: this.xLayout.labelOffset,
      numTicks: axis.config.tickCount,
      orientation: axis.config.orient,
      tickComponent: createTickComponent(this.xLayout),
      tickFormat: axis.formatValue
    }, props)) : null;
  }

  renderYAxis(props) {
    const {
      axis
    } = this.yEncoder;
    return axis && this.yLayout ? /*#__PURE__*/React.createElement(YAxis, _extends({
      label: axis.getTitle(),
      labelOffset: this.yLayout.labelOffset,
      numTicks: axis.config.tickCount,
      orientation: axis.config.orient,
      tickFormat: axis.formatValue
    }, props)) : null;
  }

}