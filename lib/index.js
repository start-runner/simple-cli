#!/usr/bin/env node
import path from 'path';
import requireCwd from 'req-cwd';

if (process.argv.length < 3) {
    console.error('Usage: start-runner <tasks file or moduleID to require> <tasks runner name>');
    process.exit(0);
}

const tasksPath = process.argv[2];
const tasksRunnerName = process.argv[3];

// `start start-my-preset` or `start ./tasks-file`
let tasks = requireCwd.silent(tasksPath);

if (tasks === null) {
    // `start tasks-file`
    tasks = require(path.resolve(tasksPath));
}

const tasksRunner = tasks[tasksRunnerName];

if (typeof tasksRunner !== 'function') {
    if (typeof tasksRunnerName !== 'undefined') {
        console.error(`Unable to find tasks runner "${tasksRunnerName}"`);
        console.error(`Available tasks runners: "${Object.keys(tasks).join('", "')}"`);
        process.exit(1);
    }

    console.log(`Available tasks runners: "${Object.keys(tasks).join('", "')}"`);
    process.exit(0);
}

tasksRunner().catch(() => {
    process.exit(1);
});
