#!/usr/bin/env node
import CLI from './';

if (process.argv.length < 3) {
    throw 'Usage: start [tasks file or moduleID to require] <tasks runner name>';
}

let tasksPath = process.argv[2];
let tasksRunnerName = process.argv[3];

if (typeof tasksRunnerName === 'undefined') {
    tasksRunnerName = tasksPath;
    tasksPath = './tasks';
}

CLI(tasksPath, tasksRunnerName);
