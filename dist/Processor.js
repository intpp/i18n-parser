'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _recursiveReaddir = require('recursive-readdir');

var _recursiveReaddir2 = _interopRequireDefault(_recursiveReaddir);

var _utils = require('./utils');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Processor = function Processor(configPath) {
  var regex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  (0, _classCallCheck3.default)(this, Processor);

  _initialiseProps.call(this);

  this.regex = regex;

  return this.loadConfig(_path2.default.resolve(configPath));
};

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.languages = [];
  this.workingDir = '';
  this.sourceDir = '';
  this.outputDir = '';
  this.translations = {};
  this.regex = [];

  this.loadConfig = function (configPath) {
    _this.workingDir = _path2.default.resolve('' + _path2.default.parse(configPath).dir);

    return (0, _utils.readJsonFile)(configPath).then(function (data) {
      if (!data) {
        throw new Error('Invalid configuration.');
      }

      if (!Array.isArray(data.languages) || data.languages.length === 0) {
        throw new Error('Configuration must have "languages".');
      }

      _this.languages = data.languages;

      if (!data.outputDir) {
        throw new Error('Configuration must have "outputDir".');
      }

      _this.outputDir = _this.resolvePath(data.outputDir);

      if (!data.sourceDir) {
        throw new Error('Configuration must have "sourceDir".');
      }

      _this.sourceDir = _this.resolvePath(data.sourceDir);

      return _this;
    });
  };

  this.resolvePath = function (p) {
    return _path2.default.resolve('' + _this.workingDir + _path2.default.sep + p);
  };

  this.process = function () {
    return new _promise2.default(function (resolve, reject) {
      (0, _recursiveReaddir2.default)(_this.sourceDir, ['^*.js'], function (err, files) {
        if (err) {
          reject(err);
          return;
        }

        var result = {};
        files.reduce(function (res, item) {
          return res.push.apply(res, (0, _toConsumableArray3.default)(_this.matchTranslations(_fs2.default.readFileSync(item, { encoding: 'UTF-8' }), _this.regex))), res;
        }, []).forEach(function (item) {
          return (0, _utils.patchObject)(result, item, '');
        });

        resolve(result);
      });
    }).then(function (translations) {
      return _this.translations = translations, _this;
    });
  };

  this.matchTranslations = function (content, regex) {
    var translations = [];

    if (content) {
      regex.forEach(function (_ref) {
        var tag = _ref.tag,
            value = _ref.value;

        var tags = content.match(tag);

        if (tags) {
          tags.forEach(function (item) {
            var match = item.match(value);

            if (match) {
              translations.push(match[1]);
            }
          });
        }
      });
    }

    return translations;
  };

  this.save = function () {
    if ((0, _keys2.default)(_this.translations).length > 0) {
      _this.languages.forEach(function (language) {
        var translationPath = _path2.default.resolve('' + _this.outputDir + _path2.default.sep + language + '.json');

        (0, _utils.readJsonFile)(translationPath).then(function (current) {
          return (0, _utils.writeJsonFile)(translationPath, _lodash2.default.defaultsDeep(current || {}, _this.translations));
        }, function (error) {
          return (0, _utils.writeJsonFile)(translationPath, _this.translations);
        });
      });
    }
  };
};

exports.default = Processor;