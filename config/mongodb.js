require('dotenv').config()
var delay = require('delay')
// Requiring module
const mongoose = require('mongoose')
 
// Connecting to database
mongoose.connect(process.env.MONGO_CONNECTION_STRING,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		// useFindAndModify: false
	})

// set log debug
mongoose.set('debug', true)

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connect database error:'))
db.once('open', function (callback) {
	console.log('Mongo database connected.')
});

async function waitForDbConnection() {
	while (true) {
		if (db._readyState==1) break
		await delay(1000)
	}
}
exports.waitForDbConnection = waitForDbConnection
