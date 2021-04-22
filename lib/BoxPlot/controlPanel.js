"use strict";

exports.__esModule = true;
exports.default = void 0;

var _core = require("@superset-ui/core");

var _chartControls = require("@superset-ui/chart-controls");

/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var _default = {
  controlPanelSections: [{
    label: (0, _core.t)('Query'),
    expanded: true,
    controlSetRows: [['metrics'], ['adhoc_filters'], ['custom_filters'], ['groupby'], ['limit']]
  }, {
    label: (0, _core.t)('Chart Options'),
    expanded: true,
    controlSetRows: [['color_scheme', 'label_colors'], [{
      name: 'whisker_options',
      config: {
        type: 'SelectControl',
        freeForm: true,
        label: (0, _core.t)('Whisker/outlier options'),
        default: 'Tukey',
        description: (0, _core.t)('Determines how whiskers and outliers are calculated.'),
        choices: (0, _chartControls.formatSelectOptions)(['Tukey', 'Min/max (no outliers)', '2/98 percentiles', '9/91 percentiles'])
      }
    }, {
      name: 'x_ticks_layout',
      config: {
        type: 'SelectControl',
        label: (0, _core.t)('X Tick Layout'),
        choices: (0, _chartControls.formatSelectOptions)(['auto', 'flat', '45°', 'staggered']),
        default: 'auto',
        clearable: false,
        renderTrigger: true,
        description: (0, _core.t)('The way the ticks are laid out on the X-axis')
      }
    }]]
  }]
};
exports.default = _default;