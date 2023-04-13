const moment = require('moment');
const Report = require('../models/report-model');
const User = require('../models/user-model');


module.exports = {
  statsUser: async () => {
    const startDayUnixTime = moment().startOf('day');
    const startWeekUnixTime = moment().startOf('week');
    const startMonthUnixTime = moment().startOf('month');
        
    const data = await Report.find({
      $or: [
        { type: 'ALL' },
        { type: 'DAY', time: startDayUnixTime },
        { type: 'WEEK', time: startWeekUnixTime },
        { type: 'MONTH', time: startMonthUnixTime }
      ]
    });

    const allData = data.find(e => e.type == 'ALL');
    const dayData = data.find(e => e.type == 'DAY');
    const weekData = data.find(e => e.type == 'WEEK');
    const monthData = data.find(e => e.type == 'MONTH');

    return {
      all: allData? allData.totalUser : 0,
      day: dayData ? dayData.totalUser : 0, 
      week: weekData ? weekData.totalUser : 0, 
      month: monthData ? monthData.totalUser : 0
    }
  }
}
