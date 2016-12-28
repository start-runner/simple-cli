#!/usr/bin/env node

/* eslint-disable no-sync */

import fs from 'fs';
import commander from 'commander';
import resolveCwd from 'resolve-cwd';

commander
  .usage('[options] <tasks runner> [arguments]')
  .option('-f, --file, <file>', 'tasks file path, tasks.js by default')
  .option('-p, --preset, <preset>', 'tasks preset')
  .parse(process.argv);

let modulePath = null;
let useBabel = false;

if (commander.preset) {
  modulePath = resolveCwd(commander.preset);
  if (!modulePath || !fs.existsSync(modulePath)) {
    console.error(`Unable to find "${commander.preset}" preset, please check it again`);
    process.exit(1);
  }
} else if (commander.file) {
  if (commander.file.match(/(\.babel\.js|\.es6?)$/)) {
    useBabel = true;
  }
  modulePath = resolveCwd(`./${commander.file}`);
  if (!modulePath || !fs.existsSync(modulePath)) {
    console.error(`Unable to find "${commander.file}" file, please check it again`);
    process.exit(1);
  }
} else {
  modulePath = resolveCwd('./tasks.js');
  if (!modulePath) {
    useBabel = true;
    modulePath = resolveCwd('./tasks.babel.js');
  }
  if (!modulePath || !fs.existsSync(modulePath)) {
    console.error('Unable to find "tasks.js" file, please check it again');
    process.exit(1);
  }
}

if (useBabel) {
  require('babel-register'); // eslint-disable-line
}

const tasks = require(modulePath);

const getAvailableTasksRunnersMessage = () => {
  return `Available tasks runners: "${Object.keys(tasks).join('", "')}"`;
};

if (commander.args.length === 0) {
  console.log('Tasks runner is required');
  console.log(getAvailableTasksRunnersMessage());
  process.exit(0);
}

const tasksRunnerName = commander.args[0];
const tasksRunner = tasks[tasksRunnerName];

if (typeof tasksRunner === 'undefined') {
  console.error(`Unable to find tasks runner "${tasksRunnerName}"`);
  console.error(getAvailableTasksRunnersMessage());
  process.exit(1);
}

const tasksRunnerArgs = commander.args.slice(1);

tasksRunner(...tasksRunnerArgs).catch(() => {
  process.exit(1);
});
