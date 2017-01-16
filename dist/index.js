#!/usr/bin/env node
'use strict';

var _commandLineArgs = require('command-line-args');

var _commandLineArgs2 = _interopRequireDefault(_commandLineArgs);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _Processor = require('./Processor');

var _Processor2 = _interopRequireDefault(_Processor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var params = (0, _commandLineArgs2.default)(_config2.default.commandLineArgs);

if (!params.config) {
  throw new Error('Missing required argument "config"');
}

new _Processor2.default(params.config, _config2.default.regex).then(function (processor) {
  return processor.process();
}).then(function (processor) {
  return processor.save();
});