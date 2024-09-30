const { expect } = require('chai');
const dbClient = require('../utils/db');

describe('DB Client', () => {
  before((done) => {
    dbClient.client.dropDatabase().then(() => done());
  });

  it('should create and retrieve a document', (done) => {
    const testDoc = { name: 'test_name', value: 'test_value' };
    dbClient.client.collection('test').insertOne(testDoc, (err, res) => {
      expect(err).to.be.null;
      dbClient.client.collection('test').findOne({ name: 'test_name' }, (err, doc) => {
        expect(err).to.be.null;
        expect(doc).to.include(testDoc);
        done();
      });
    });
  });

  it('should delete a document', (done) => {
    dbClient.client.collection('test').insertOne({ name: 'delete_name', value: 'delete_value' }, (err, res) => {
      expect(err).to.be.null;
      dbClient.client.collection('test').deleteOne({ name: 'delete_name' }, (err, res) => {
        expect(err).to.be.null;
        dbClient.client.collection('test').findOne({ name: 'delete_name' }, (err, doc) => {
          expect(err).to.be.null;
          expect(doc).to.be.null;
          done();
        });
      });
    });
  });
});
