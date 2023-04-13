const Agenda = require('agenda');
const reportJob = require('../jobs/report-job');


const agenda = new Agenda({ 
  db: { 
    address: process.env.MONGO_CONNECTION_STRING, 
    collection: 'agendaJobs' 
  },
  // processEvery: '30 seconds',
  // maxConcurrency: 1
});

reportJob(agenda);
agenda.start();

module.exports = agenda;
