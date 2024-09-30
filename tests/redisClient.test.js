const { expect } = require('chai');
const redisClient = require('../utils/redis');

describe('Redis Client', () => {
  before((done) => {
    redisClient.client.flushdb(done);
  });

  it('should be able to set and get a value', (done) => {
    redisClient.set('test_key', 'test_value', 10);
    redisClient.get('test_key').then((value) => {
      expect(value).to.equal('test_value');
      done();
    });
  });

  it('should delete a key', (done) => {
    redisClient.set('delete_key', 'to_be_deleted', 10);
    redisClient.del('delete_key');
    redisClient.get('delete_key').then((value) => {
      expect(value).to.be.null;
      done();
    });
  });
});

