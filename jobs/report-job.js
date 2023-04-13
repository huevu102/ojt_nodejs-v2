const	User = require('../models/user-model');
const Report = require('../models/report-model');
const moment = require('moment');
// bluebird promise xử lý các hàm asynchronous
const Promise = require('bluebird');
const reportLog = require('../config/log4js');


module.exports = function (agenda) {
	agenda.define('user-count', { concurrency: 1 }, async (job, done) => {
    reportLog.log(job);

    // const { user } = job.attrs.data; ???? lam gi

    const startDayUnixTime = moment().startOf('day');
    const endDayUnixTime = moment().endOf('day');

    const startWeekUnixTime = moment().startOf('week');
    const endWeekUnixTime = moment().endOf('week');

    const startMonthUnixTime = moment().startOf('month');
    const endMonthUnixTime = moment().endOf('month');


    reportLog.log("Job user-count start.")


    const [ totalUser, newUserInDay, newUserInWeek, newUserInMonth ] = await Promise.all([
      User.count({
        type: 'user'
      }),

      User.count({
        type: 'user',
        createdAt: {
          $gte: startDayUnixTime,
          $lte: endDayUnixTime
        }
      }),

      User.count({
        type: 'user',
        createdAt: {
          $gte: startWeekUnixTime,
          $lte: endWeekUnixTime
        }
      }),

      User.count({
        type: 'user',
        createdAt: {
          $gte: startMonthUnixTime,
          $lte: endMonthUnixTime
        }
      })
    ]);


    await Promise.all([
      Report.findOneAndUpdate(
        { type: 'ALL' },
        { type: 'ALL', totalUser: totalUser },
        { upsert: true }
      ),

      Report.findOneAndUpdate(
        { time: startDayUnixTime, type: 'DAY' },
        { time: startDayUnixTime, type: 'DAY', totalUser: newUserInDay },
        { upsert: true }
      ),

      Report.findOneAndUpdate(
        { time: startWeekUnixTime, type: 'WEEK' },
        { time: startWeekUnixTime, type: 'WEEK', totalUser: newUserInWeek },
        { upsert: true }
      ),

      Report.findOneAndUpdate(
        { time: startMonthUnixTime, type: 'MONTH' },
        { time: startMonthUnixTime, type: 'MONTH', totalUser: newUserInMonth },
        { upsert: true }
      )
    ])

    reportLog.log("Successfully created report.");

    done();
	});
};
