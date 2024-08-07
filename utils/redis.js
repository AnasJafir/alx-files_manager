import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.redisClient = createClient();
    this.redisClient.on('error', (error) => {
      console.log(error.message);
    });
  }

  isAlive() {
    return this.redisClient.connected;
  }

  async get(key) {
    const asyncGet = promisify(this.redisClient.get).bind(this.redisClient);
    const value = await asyncGet(key);
    return value;
  }

  async set(key, value, duration) {
    const asyncSet = promisify(this.redisClient.set).bind(this.redisClient);
    await asyncSet(key, value, 'EX', duration);
  }

  async del(key) {
    const asyncDel = promisify(this.redisClient.del).bind(this.redisClient);
    await asyncDel(key);
  }

  async close() {
    this.redisClient.quit();
  }
}

const redisClient = new RedisClient();
export default redisClient;
