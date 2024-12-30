const redis = require('redis');

class RedisPubsubService {
    constructor() {
        this.publisher = redis.createClient();
        const client = redis.createClient();
        this.subscriber = client.duplicate();

    }

    async subscribe(channel, callback) {
        await this.subscriber.connect();
        await this.subscriber.subscribe(channel, callback);
    }

    async publish(channel, message) {
        await this.publisher.connect();
        await this.publisher.publish(channel, message);

    }
}

module.exports = new RedisPubsubService();