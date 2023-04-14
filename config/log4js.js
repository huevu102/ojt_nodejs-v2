const log4js = require('log4js');

log4js.configure({
  appenders: { report: { type: "console" }, report: { type: "file", filename: "logs/report.log" } },
  categories: { default: { appenders: ["report"], level: "trace" } },
});

const reportLog = log4js.getLogger('report');

module.exports = reportLog;
