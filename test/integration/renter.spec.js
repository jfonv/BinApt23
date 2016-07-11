/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');
// const Bookmark = require('../../dst/models/apartments');

describe('renters', () => {
  beforeEach((done) => {
    console.log('inside beforeEach');
    cp.execFile(`${__dirname}/../scripts/populate.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      console.log('exit beforeEach');
      done();
    });
  });

  describe('create renter', () => {
    it('should create an renter', (done) => {
      request(app)
      .post('/renters/')
      .send({ name: 'bob', money: 53000 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter.name).to.equal('bob');
        done();
      });
    });
    it('should not create a renter with an invalid name', (done) => {
      request(app)
      .post('/renters/')
      .send({ name: '123', money: 53000 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.renter).to.be.undefined;
        done();
      });
    });
    it('should not create a renter with less than $1200', (done) => {
      request(app)
      .post('/renters/')
      .send({ name: 'aaaa', money: 1100 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.have.length(1);
        done();
      });
    });
  });
  describe('get /renters', () => {
    it('should get all the renters', (done) => {
      request(app)
      .get('/renters')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renters).to.have.length(5);
        done();
      });
    });
    it('should get renter by id', (done) => {
      request(app)
      .get('/renters/5783e34564b4f0f9cc9788cc')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter.name).to.equal('Rob');
        done();
      });
    });
  });
  describe('update /renters', () => {
    it('should update renter by id', (done) => {
      request(app)
      .put('/renters/5783e34564b4f0f9cc9788cc')
      .send({ name: 'Rob', money: 14000 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter._id).to.equal('5783e34564b4f0f9cc9788cc');
        done();
      });
    });
    it('should not update renter - bad id', (done) => {
      request(app)
      .put('/renters/5783e20754b4f0f9cc')
      .send({ name: 'John', money: 2600 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.have.length(1);
        done();
      });
    });
  });
  describe('delete /renters', () => {
    it('should renter by id', (done) => {
      request(app)
      .delete('/renters/5783e34564b4f0f9cc9788cc')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.id).to.equal('5783e34564b4f0f9cc9788cc');
        done();
      });
    });
    it('should NOT delete a renter - does not exist', (done) => {
      request(app)
      .delete('/renters/01234567890123456789ab11')
      .end((err2, rsp) => {
        expect(err2).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.equal('id not found');
        done();
      });
    });
    it('should NOT delete a renter - bad id', (done) => {
      request(app)
      .delete('/renters/renter')
      .end((err2, rsp) => {
        expect(err2).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.contain('"id" with value "renter" fails to match the required pattern');
        done();
      });
    });
  });
});
