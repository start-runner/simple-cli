#!/usr/bin/env node
import path from 'path';
import requireCwd from 'req-cwd';

if (process.argv.length < 4) {
    throw 'Usage: start <tasks file or moduleID to require> <tasks runner name>';
}

const tasksPath = process.argv[2];
const tasksRunnerName = process.argv[3];

// `start start-my-preset` or `start ./tasks-file`
let tasks = requireCwd.silent(tasksPath);

if (tasks === null) {
    try {
        // `start tasks-file`
        tasks = require(path.resolve(tasksPath));
    } catch (e) {
        throw `Unable to resolve tasks path "${tasksPath}"`;
    }
}

const tasksRunner = tasks[tasksRunnerName];

if (typeof tasksRunner !== 'function') {
    throw `Unable to find tasks runner "${tasksRunnerName}" in "${tasksPath}"`;
}

tasksRunner().catch(() => {
    process.exit(1);
});
