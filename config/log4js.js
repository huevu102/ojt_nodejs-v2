const log4js = require('log4js');

log4js.configure({
  appenders: { report: { type: "file", filename: "logs/report.log" } },
  categories: { default: { appenders: ["report"], level: "info" } },
});

const reportLog = log4js.getLogger('report');

module.exports = reportLog;
