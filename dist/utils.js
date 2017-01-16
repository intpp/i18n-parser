'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchObject = exports.parseJson = exports.writeJsonFile = exports.readJsonFile = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseJson = function parseJson(data) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultValue;
  }
};

var readJsonFile = function readJsonFile(src) {
  return new _promise2.default(function (resolve, reject) {
    _fs2.default.readFile(src, { encoding: 'UTF-8' }, function (error, data) {
      if (error) {
        return reject(error);
      }

      if (!data) {
        return resolve(null);
      }

      data = parseJson(data, null);

      if (!data) {
        return reject(new Error('File must be a valid json file. (' + src + ')'));
      }

      return resolve(data);
    });
  });
};

var writeJsonFile = function writeJsonFile(dest, data) {
  return new _promise2.default(function (resolve, reject) {
    _fs2.default.writeFile(dest, (0, _stringify2.default)(data, null, 2), function (error) {
      if (error) {
        return reject(error);
      }

      return resolve();
    });
  });
};

var patchObject = function patchObject(object, key) {
  var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  if (/ /.test(key)) {
    object[key] = value;
  } else {
    _lodash2.default.set(object, key, value);
  }
};

exports.readJsonFile = readJsonFile;
exports.writeJsonFile = writeJsonFile;
exports.parseJson = parseJson;
exports.patchObject = patchObject;