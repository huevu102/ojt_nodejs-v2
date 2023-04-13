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

(async function () {
	// IIFE to give access to async/await
	await agenda.start();

	await agenda.every('1 minute', 'user-count');

})();

module.exports = agenda;
