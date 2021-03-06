function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
export default function createTickComponent({
  axisWidth,
  labelAngle,
  labelFlush,
  labelOverlap,
  orient,
  tickLabels,
  tickLabelDimensions,
  tickTextAnchor = 'middle'
}) {
  if (labelOverlap === 'rotate' && labelAngle !== 0) {
    let xOffset = labelAngle > 0 ? -6 : 6;

    if (orient === 'top') {
      xOffset = 0;
    }

    const yOffset = orient === 'top' ? -3 : 0;
    return ({
      x,
      y,
      formattedValue = '',
      ...textStyle
    }) => /*#__PURE__*/React.createElement("g", {
      transform: `translate(${x + xOffset}, ${y + yOffset})`
    }, /*#__PURE__*/React.createElement("text", _extends({
      transform: `rotate(${labelAngle})`
    }, textStyle, {
      textAnchor: tickTextAnchor
    }), formattedValue));
  }

  if (labelFlush === true || typeof labelFlush === 'number') {
    const labelToDimensionMap = new Map();
    tickLabels.forEach((label, i) => {
      labelToDimensionMap.set(label, tickLabelDimensions[i]);
    });
    return ({
      x,
      y,
      formattedValue = '',
      ...textStyle
    }) => {
      const dimension = labelToDimensionMap.get(formattedValue);
      const labelWidth = typeof dimension === 'undefined' ? 0 : dimension.width;
      let textAnchor = tickTextAnchor;
      let xOffset = 0;

      if (x - labelWidth / 2 < 0) {
        textAnchor = 'start';

        if (typeof labelFlush === 'number') {
          xOffset -= labelFlush;
        }
      } else if (x + labelWidth / 2 > axisWidth) {
        textAnchor = 'end';

        if (typeof labelFlush === 'number') {
          xOffset += labelFlush;
        }
      }

      return /*#__PURE__*/React.createElement("text", _extends({
        x: x + xOffset,
        y: y
      }, textStyle, {
        textAnchor: textAnchor
      }), formattedValue);
    };
  } // This will render the tick as horizontal string.


  return null;
}