import fs from 'fs';
import path from 'path';
import recursive from 'recursive-readdir';
import {
  readJsonFile,
  writeJsonFile,
  patchObject,
} from './utils';
import _ from 'lodash';

class Processor {
  languages = [];
  workingDir = '';
  sourceDir = '';
  outputDir = '';
  translations = {};
  regex = [];

  constructor(configPath, regex = []) {
    this.regex = regex;

    return this.loadConfig(path.resolve(configPath));
  }

  loadConfig = (configPath) => {
    this.workingDir = path.resolve(`${path.parse(configPath).dir}`);

    return readJsonFile(configPath).then(data => {
      if (!data) {
        throw new Error('Invalid configuration.');
      }

      if (!Array.isArray(data.languages) || data.languages.length === 0) {
        throw new Error('Configuration must have "languages".');
      }

      this.languages = data.languages;

      if (!data.outputDir) {
        throw new Error('Configuration must have "outputDir".');
      }

      this.outputDir = this.resolvePath(data.outputDir);

      if (!data.sourceDir) {
        throw new Error('Configuration must have "sourceDir".');
      }

      this.sourceDir = this.resolvePath(data.sourceDir);

      return this;
    });
  };

  resolvePath = (p) => path.resolve(`${this.workingDir}${path.sep}${p}`);

  process = () => {
    return new Promise((resolve, reject) => {
      recursive(this.sourceDir, ['^*.js'], (err, files) => {
        if (err) {
          reject(err);
          return;
        }

        const result = {};
        files
          .reduce((res, item) => (
            res.push(...this.matchTranslations(
              fs.readFileSync(item, { encoding: 'UTF-8' }),
              this.regex
            )), res), [])
          .forEach(item => patchObject(result, item, ''));

        resolve(result);
      });
    })
      .then(translations => (this.translations = translations, this));
  };

  matchTranslations = (content, regex) => {
    const translations = [];

    if (content) {
      regex.forEach(({ tag, value }) => {
        const tags = content.match(tag);

        if (tags) {
          tags.forEach(item => {
            const match = item.match(value);

            if (match) {
              translations.push(match[1]);
            }
          });
        }
      });
    }

    return translations;
  };

  save = () => {
    if (Object.keys(this.translations).length > 0) {
      this.languages.forEach(language => {
        const translationPath = path.resolve(`${this.outputDir}${path.sep}${language}.json`);

        readJsonFile(translationPath)
          .then(
            current => writeJsonFile(translationPath, _.defaultsDeep(current || {}, this.translations)),
            error => writeJsonFile(translationPath, this.translations)
          );
      });
    }
  };
}

export default Processor;