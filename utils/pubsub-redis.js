const redis = require('redis');

// publisher
const publisher = redis.createClient();
try {
  publisher.connect()
    .then(() => console.log('Successfully connected to REDIS publish'));
} catch (e) {
  console.log(e);
}

function publish (channel, message) {
  publisher.publish(channel, JSON.stringify(message));
  console.log(`Published ${message} to ${channel}`);
}


// subscriber
const subscriber = redis.createClient();
try {
  subscriber.on("message", function (channel, message) {
    console.log("sub channel " + channel + ": " + message);
  });
} catch (e) {
  console.log(e);
}


module.exports = { publish, subscriber };
