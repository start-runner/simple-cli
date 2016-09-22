#!/usr/bin/env node

import path from 'path';
import commander from 'commander';
import requireCwd from 'req-cwd';

commander
    .usage('[options] <tasks runner>')
    .option('-f, --file, <file>', 'tasks file path, tasks.js by default', 'tasks.js')
    .option('-p, --preset, <preset>', 'tasks preset')
    .parse(process.argv);

let tasks = null;

if (commander.preset) {
    try {
        tasks = requireCwd(commander.preset);
    } catch (e) {
        console.error(`Unable to find "${commander.preset}" preset, please check it again`);
        process.exit(1);
    }
} else {
    try {
        tasks = require(path.resolve(commander.file));
    } catch (e) {
        console.error(`Unable to find "${commander.file}" file, please check it again`);
        process.exit(1);
    }
}

const getAvailableTasksRunnersMessage = () => {
    return `Available tasks runners: "${Object.keys(tasks).join('", "')}"`;
};

if (commander.args.length === 0) {
    console.log('Tasks runner is required');
    console.log(getAvailableTasksRunnersMessage());
    process.exit(0);
}

if (commander.args.length > 1) {
    console.error('Starting only a single tasks runner is supported');
    console.error('You should consider using of composition of tasks runners');
    process.exit(1);
}

const tasksRunnerName = commander.args[0];
const tasksRunner = tasks[tasksRunnerName];

if (typeof tasksRunner === 'undefined') {
    console.error(`Unable to find tasks runner "${tasksRunnerName}"`);
    console.error(getAvailableTasksRunnersMessage());
    process.exit(1);
}

tasksRunner().catch(() => {
    process.exit(1);
});
