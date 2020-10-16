// Require 
const express = require('express');
const cron = require('cron').CronJob;
const open = require('open');
const Shell = require('node-powershell');
const os = require('os');

// APP
const app = express();
// Define new shell
const newShell = new Shell({
    executionPolicy: 'Bypass',
    noProfile: true
});

let query = 'searching+morpheus+matrix';

// OPEN ASYNC FUNCTION
async function openBrowser() {
    await open(`https://www.bing.com/images/search?q=${query}`, { app: 'Firefox' });
    console.log('Searching...');
};

const winClose = () => {
    // DEFINE POWERSHELL COMMAND
    newShell.addCommand("Get-Process 'Firefox' | Foreach-Object { $_.CloseMainWindow() | Out-Null } | stop-process -Force");
    // INVOKE COMMAND DEFINED (promise syntax)
    newShell.invoke()
        .then(output => {
            console.log(output);
        })
        .catch(err => {
            console.log(err);
        });
};

// DEFINE CRON JOB ENGINE
let num = 1;
let myJob = new cron('*/31 * * * * *', () => {
    console.log(`${num}`);
    // Increment count
    if (num >= 13) {
        num = 0
    }
    num++;
    // Run Open function
    openBrowser();
    // Close after  sec
    if (os.platform() === 'win32') {
        // Close
        setTimeout(() => { winClose(); }, `${num}000`);
        console.log(`Is ${os.platform()}`)
    }
    if (os.platform() === 'linux') {
        console.log(`Is ${os.platform()}...`)
    }
});
// Start the job every 31s
myJob.start();

// LISTENER
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});