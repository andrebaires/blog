const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () {
	const key = JSON.stringify(Object.assign({}, { collection: this.mongooseCollection.name}, this.getQuery()));
	const cacheValue = await client.get(key);
	if (cacheValue) {
		console.log('Retrieved from cache');
		return JSON.parse(cacheValue);
	}
	const result = await exec.apply(this, arguments);

	client.set(key, JSON.stringify(result));

	return result;
};