const moment = require('moment');
const Report = require('../models/report-model');
const User = require('../models/user-model');


module.exports = {
  statsUser: async () => {
    const startDay = moment().startOf('day');
    const startWeek = moment().startOf('week');
    const startMonth = moment().startOf('month');
        
    const data = await Report.find({
      $or: [
        { type: 'ALL' },
        { type: 'DAY', time: startDay },
        { type: 'WEEK', time: startWeek },
        { type: 'MONTH', time: startMonth }
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
