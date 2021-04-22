import { pick } from 'lodash';
export default function transformProps(chartProps) {
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
    ...pick(hooks, fieldsFromHooks)
  };
}