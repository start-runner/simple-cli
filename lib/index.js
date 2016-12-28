#!/usr/bin/env node

import fs from 'fs';
import commander from 'commander';
import resolveCwd from 'resolve-cwd';

commander
  .usage('[options] <tasks runner> [arguments]')
  .option('-f, --file, <file>', 'tasks file path, tasks.js by default', 'tasks.js')
  .option('-p, --preset, <preset>', 'tasks preset')
  .parse(process.argv);

let modulePath = null;

if (commander.preset) {
  modulePath = resolveCwd(commander.preset);
  if (!modulePath || !fs.existsSync(modulePath)) { // eslint-disable-line
    console.error(`Unable to find "${commander.preset}" preset, please check it again`);
    process.exit(1);
  }
} else {
  modulePath = resolveCwd(`./${commander.file}`);
  if (!modulePath || !fs.existsSync(modulePath)) { // eslint-disable-line
    console.error(`Unable to find "${commander.file}" file, please check it again`);
    process.exit(1);
  }
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
