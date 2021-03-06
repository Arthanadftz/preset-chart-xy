import _pt from "prop-types";
import React, { PureComponent } from 'react';
import { kebabCase, groupBy, flatMap, uniqueId, values } from 'lodash';
import { AreaSeries, LinearGradient, LineSeries, XYChart, CrossHair, WithTooltip } from '@data-ui/xy-chart';
import { chartTheme } from '@data-ui/theme';
import { WithLegend } from '@superset-ui/core';
import { createSelector } from 'reselect';
import DefaultTooltipRenderer from './DefaultTooltipRenderer';
import createMarginSelector, { DEFAULT_MARGIN } from '../../utils/createMarginSelector';
import convertScaleToDataUIScale from '../../utils/convertScaleToDataUIScaleShape';
import createXYChartLayoutWithTheme from '../../utils/createXYChartLayoutWithTheme';
import createRenderLegend from '../legend/createRenderLegend';
import { lineEncoderFactory } from './Encoder';
import DefaultLegendItemMarkRenderer from './DefaultLegendItemMarkRenderer';
const defaultProps = {
  className: '',
  encoding: {},
  LegendItemMarkRenderer: DefaultLegendItemMarkRenderer,
  margin: DEFAULT_MARGIN,
  theme: chartTheme,
  TooltipRenderer: DefaultTooltipRenderer
};
/** Part of formData that is needed for rendering logic in this file */

const CIRCLE_STYLE = {
  strokeWidth: 1.5
};
export default class LineChart extends PureComponent {
  constructor(...args) {
    super(...args);
    this.createEncoder = lineEncoderFactory.createSelector();
    this.createAllSeries = createSelector(input => input.encoder, input => input.data, (encoder, data) => {
      const {
        channels
      } = encoder;
      const fieldNames = encoder.getGroupBys();
      const groups = groupBy(data, row => fieldNames.map(f => `${f}=${row[f]}`).join(','));
      const allSeries = values(groups).map(seriesData => {
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
    this.createMargin = createMarginSelector();

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
      const layout = createXYChartLayoutWithTheme({
        width,
        height,
        margin: this.createMargin(margin),
        theme,
        xEncoder: channels.x,
        yEncoder: channels.y
      });
      return layout.renderChartWithFrame(chartDim => /*#__PURE__*/React.createElement(WithTooltip, {
        renderTooltip: ({
          datum,
          series
        }) => /*#__PURE__*/React.createElement(TooltipRenderer, {
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
      }) => /*#__PURE__*/React.createElement(XYChart, {
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
        xScale: convertScaleToDataUIScale(channels.x.definition.scale) // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ,
        yScale: convertScaleToDataUIScale(channels.y.definition.scale),
        onMouseMove: onMouseMove,
        onMouseLeave: onMouseLeave
      }, layout.renderXAxis(), layout.renderYAxis(), this.renderSeries(allSeries), /*#__PURE__*/React.createElement(CrossHair, {
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
    const filledSeries = flatMap(allSeries.filter(({
      fill
    }) => fill).map(series => {
      const gradientId = uniqueId(kebabCase(`gradient-${series.key}`));
      return [/*#__PURE__*/React.createElement(LinearGradient, {
        key: `${series.key}-gradient`,
        id: gradientId,
        from: series.stroke,
        to: "#fff"
      }), /*#__PURE__*/React.createElement(AreaSeries, {
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
    }) => !fill).map(series => /*#__PURE__*/React.createElement(LineSeries, {
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
    return /*#__PURE__*/React.createElement(WithLegend, {
      className: `superset-chart-line ${className}`,
      width: width,
      height: height,
      position: "top",
      renderLegend: createRenderLegend(this.createEncoder(encoding), data, this.props),
      renderChart: this.renderChart
    });
  }

}
LineChart.propTypes = {
  className: _pt.string,
  width: _pt.oneOfType([_pt.string, _pt.number]).isRequired,
  height: _pt.oneOfType([_pt.string, _pt.number]).isRequired,
  TooltipRenderer: _pt.elementType,
  theme: _pt.any
};
LineChart.defaultProps = defaultProps;