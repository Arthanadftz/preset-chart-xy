import { pick } from 'lodash';
export default function transformProps(chartProps) {
  const {
    width,
    height,
    formData,
    queryData
  } = chartProps;
  const {
    margin,
    theme
  } = formData;
  const encoding = formData.encoding;
  const data = queryData.data.map(({
    label,
    values
  }) => ({
    label,
    min: values.whisker_low,
    max: values.whisker_high,
    firstQuartile: values.Q1,
    median: values.Q2,
    thirdQuartile: values.Q3,
    outliers: values.outliers
  }));
  const isHorizontal = encoding.y.type === 'nominal';
  const boxPlotValues = data.reduce((r, e) => {
    r.push(e.min, e.max, ...e.outliers);
    return r;
  }, []);
  const minBoxPlotValue = Math.min(...boxPlotValues);
  const maxBoxPlotValue = Math.max(...boxPlotValues);
  const valueDomain = [minBoxPlotValue - 0.1 * Math.abs(minBoxPlotValue), maxBoxPlotValue + 0.1 * Math.abs(maxBoxPlotValue)];

  if (isHorizontal) {
    if (encoding.x.scale) {
      encoding.x.scale.domain = valueDomain;
    } else {
      encoding.x.scale = {
        domain: valueDomain
      };
    }
  } else if (encoding.y.scale) {
    encoding.y.scale.domain = valueDomain;
  } else {
    encoding.y.scale = {
      domain: valueDomain
    };
  }

  const hooks = chartProps.hooks;
  const fieldsFromHooks = ['TooltipRenderer', 'LegendRenderer', 'LegendGroupRenderer', 'LegendItemRenderer', 'LegendItemMarkRenderer', 'LegendItemLabelRenderer'];
  return {
    data,
    width,
    height,
    margin,
    theme,
    encoding,
    ...pick(hooks, fieldsFromHooks)
  };
}