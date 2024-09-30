const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

describe('API Endpoints', () => {
  it('GET /status should return status', (done) => {
    request(app)
      .get('/status')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.include({ redis: true, db: true });
        done();
      });
  });

  it('GET /stats should return stats', (done) => {
    request(app)
      .get('/stats')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.keys(['users', 'files']);
        done();
      });
  });

  it('POST /users should create a user', (done) => {
    request(app)
      .post('/users')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(201)
      .end((err, res) => {
        expect(res.body).to.have.property('id');
        done();
      });
  });

  it('GET /connect should login user', (done) => {
    request(app)
      .get('/connect')
      .auth('test@example.com', 'password')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('GET /disconnect should logout user', (done) => {
    request(app)
      .get('/disconnect')
      .auth('test@example.com', 'password')
      .expect(204)
      .end((err, res) => {
        done();
      });
  });

  it('GET /users/me should return user details', (done) => {
    request(app)
      .get('/users/me')
      .auth('test@example.com', 'password')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('email');
        done();
      });
  });

  it('POST /files should create a new file', (done) => {
    request(app)
      .post('/files')
      .send({ name: 'test.txt', type: 'file', data: 'SGVsbG8gd29ybGQ=' })
      .expect(201)
      .end((err, res) => {
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('name');
        done();
      });
  });

  it('GET /files/:id should get file details', (done) => {
    request(app)
      .get('/files/1')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('name');
        done();
      });
  });

  it('GET /files should get list of files with pagination', (done) => {
    request(app).get('/files').query({ page: 1, size: 10 }).expect(200).end((err, res) => {
      expect(res.body).to.have.property('files');
      done();
    });
  });

  it('PUT /files/:id/publish should publish the file', (done) => {
    request(app)
      .put('/files/1/publish')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('isPublic', true);
        done();
      });
  });

  it('PUT /files/:id/unpublish should unpublish the file', (done) => {
    request(app)
      .put('/files/1/unpublish')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('isPublic', false);
        done();
      });
  });

  it('GET /files/:id/data should get file data', (done) => {
    request(app)
      .get('/files/1/data')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be('SGVsbG8gd29ybGQ='); // Expecting the base64 data
        done();
      });
  });
});

