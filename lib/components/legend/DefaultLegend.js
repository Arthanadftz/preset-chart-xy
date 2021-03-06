"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _DefaultLegendGroup = _interopRequireDefault(require("./DefaultLegendGroup"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const LEGEND_CONTAINER_STYLE = {
  display: 'flex',
  flexBasis: 'auto',
  flexGrow: 1,
  flexShrink: 1,
  maxHeight: 100,
  overflowY: 'auto',
  position: 'relative'
};

class DefaultLegend extends _react.PureComponent {
  render() {
    const {
      groups,
      LegendGroupRenderer = _DefaultLegendGroup.default,
      LegendItemRenderer,
      LegendItemMarkRenderer,
      LegendItemLabelRenderer,
      style
    } = this.props;
    const combinedStyle = typeof style === 'undefined' ? LEGEND_CONTAINER_STYLE : { ...LEGEND_CONTAINER_STYLE,
      ...style
    };
    return /*#__PURE__*/_react.default.createElement("div", {
      style: combinedStyle
    }, groups.filter(group => 'items' in group && group.items.length > 0).map(group => /*#__PURE__*/_react.default.createElement(LegendGroupRenderer, {
      key: group.field,
      group: group,
      ItemRenderer: LegendItemRenderer,
      ItemMarkRenderer: LegendItemMarkRenderer,
      ItemLabelRenderer: LegendItemLabelRenderer
    })));
  }

}

exports.default = DefaultLegend;