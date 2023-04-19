const redis = require('redis');


(async () => {
  redisClient = redis.createClient();
  //By default, redis.createClient() will use 127.0.0.1 and 6379 as the hostname and port respectively
  redisClient.on("error", (error) => console.error(`Error : ${error}`));
  await redisClient.connect()
})();


const prefix = 'huevu';

function makeRedisKey(arr) {
  arr.unshift(prefix);
  return arr.join(':');
}


async function setRedisCache(params) {
  if (!params.key) {
    console.error('Missing key');
  }
  if (params.value === undefined) {
    console.error(`Missing value to set cache with redis key ${params.key}`);
  }

  let value = JSON.stringify(params.value);
  return await params.ttl ? redisClient.set( params.key, value, 'EX', params.ttl ) : redisClient.set( params.key, value );
}

async function redisCacheExecute( params, callback ) {
  let key = params.key;
  let ttl = params.ttl;

  if(!key) {
    console.error('Missing key');
  }

  return redisClient.get(key)
    .then(cachedData => {
      if (!cachedData) {
        return callback()
          .then(data => {
            return setRedisCache( { key: key, value: data, ttl: ttl } )
              .then(() => { return data })
          })
      } else {
        return JSON.parse(cachedData);
      }
    })
}


module.exports = { makeRedisKey, setRedisCache, redisCacheExecute }
