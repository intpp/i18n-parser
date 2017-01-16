'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  regex: [{
    tag: new RegExp(/<Translate[^>]+\/>/gi),
    value: new RegExp(/value=['"]([^'"]+)['"]/i)
  }, {
    tag: new RegExp(/I18n.t\([^)]+\)/gi),
    value: new RegExp(/\(\\?['"]([^'"]+)\\?['"]([^\)]+)?\)/i)
  }],
  commandLineArgs: [{ name: 'config', type: String }]
};