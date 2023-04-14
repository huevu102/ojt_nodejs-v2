const	User = require('../models/user-model');
const Report = require('../models/report-model');
const moment = require('moment');
// bluebird promise xử lý các hàm asynchronous
const Promise = require('bluebird');
const reportLog = require('../config/log4js');
const bot = require('../utils/telegram-bot');


module.exports = function (agenda) {
	agenda.define('user-count', { concurrency: 1 }, async (job, done) => {
    reportLog.trace(job);

    // const { user } = job.attrs.data; ???? lam gi

    const startDay = moment().startOf('day');
    const endDay = moment().endOf('day');

    const startWeek = moment().startOf('week');
    const endWeek = moment().endOf('week');

    const startMonth = moment().startOf('month');
    const endMonth = moment().endOf('month');


    reportLog.trace("Job user-count start.")


    const [ totalUser, newUserInDay, newUserInWeek, newUserInMonth ] = await Promise.all([
      User.count({
        type: 'user'
      }),

      User.count({
        type: 'user',
        createdAt: {
          $gte: startDay,
          $lte: endDay
        }
      }),

      User.count({
        type: 'user',
        createdAt: {
          $gte: startWeek,
          $lte: endWeek
        }
      }),

      User.count({
        type: 'user',
        createdAt: {
          $gte: startMonth,
          $lte: endMonth
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
        { time: startDay, type: 'DAY' },
        { time: startDay, type: 'DAY', totalUser: newUserInDay },
        { upsert: true }
      ),

      Report.findOneAndUpdate(
        { time: startWeek, type: 'WEEK' },
        { time: startWeek, type: 'WEEK', totalUser: newUserInWeek },
        { upsert: true }
      ),

      Report.findOneAndUpdate(
        { time: startMonth, type: 'MONTH' },
        { time: startMonth, type: 'MONTH', totalUser: newUserInMonth },
        { upsert: true }
      )
    ])

    reportLog.trace("Successfully created user-count report.");

    bot.sendMessage("User-count job done!\n" + 
      `[Total user]: ${totalUser}\n[New in day]: ${newUserInDay}\n[New in week]: ${newUserInWeek}\n[New in month]: ${newUserInMonth}`);

    done();
	});
};
