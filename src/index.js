#!/usr/bin/env node

import commandLineArgs from 'command-line-args';
import config from './config';
import Processor from './Processor';

const params = commandLineArgs(config.commandLineArgs);

if (!params.config) {
  throw new Error('Missing required argument "config"');
}

(new Processor(params.config, config.regex))
  .then(processor => processor.process())
  .then(processor => processor.save());