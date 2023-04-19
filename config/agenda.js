const Agenda = require('agenda');
const reportJob = require('../jobs/report-job');
const { subscriber } = require('../utils/pubsub-redis');



const agenda = new Agenda({ 
  db: { 
    address: process.env.MONGO_CONNECTION_STRING, 
    collection: 'agendaJobs'
  },
  processEvery: "1o seconds",
  maxConcurrency: 1
});

reportJob(agenda);

// (async function () {
// 	// IIFE to give access to async/await
//   await agenda.start();
// 	// await agenda.every('1 minute', 'user-count');
// })();

agenda.start();

// run user-count job
subscriber.subscribe('create-new-user')
 .then(() => {
  agenda.on('ready', () => { agenda.schedule('now', 'user-count') })
})


module.exports = agenda;
