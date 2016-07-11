/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');
// const Bookmark = require('../../dst/models/apartments');

describe('apartments', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populate.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      done();
    });
  });

  describe('create apartment', () => {
    it('should create an apartment', (done) => {
      request(app)
      .post('/apartments/')
      .send({ name: 'a1', sqft: 1300, bedrooms: 3,
              floor: 1, rent: 2500 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment.name).to.equal('a1');
        done();
      });
    });

    it('should not create an apartment with an invalid sqft', (done) => {
      request(app)
      .post('/apartments/')
      .send({ name: 'a1', sqft: -100, bedrooms: 3,
              floor: 1, rent: 2500 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.apartment).to.be.undefined;
        done();
      });
    });
    it('should not create an apartment with invalid floor, bedroom ', (done) => {
      request(app)
      .post('/apartments/')
      .send({ name: 'a1', sqft: 1100, bedrooms: 0,
              floor: -1, rent: 2500 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.have.length(1);
        done();
      });
    });
    it('should not create an apartment without a name', (done) => {
      request(app)
      .post('/apartments/')
      .send({ name: '', sqft: 1100, bedrooms: 1,
              floor: 1, rent: 2500 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.have.length(1);
        done();
      });
    });
  });
  describe('get /apartments', () => {
    it('should get all the apartments', (done) => {
      request(app)
      .get('/apartments')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartments).to.have.length(5);
        done();
      });
    });
  });
  describe('update /apartments', () => {
    it('should update apartment by id', (done) => {
      request(app)
      .put('/apartments/5783e20754b4f0f9cc9788cd')
      .send({ name: 'a1', sqft: 2600, bedrooms: 3,
              floor: 1, rent: 2500, collectedRent: 0 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment._id).to.equal('5783e20754b4f0f9cc9788cd');
        done();
      });
    });
    it('should not update apartment - bad id', (done) => {
      request(app)
      .put('/apartments/5783e20754b4f0f9cc')
      .send({ name: 'a1', sqft: 2600, bedrooms: 3,
              floor: 1, rent: 2500, collectedRent: 0 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.have.length(1);
        done();
      });
    });
  });
  describe('delete /apartments', () => {
    it('should apartment by id', (done) => {
      request(app)
      .delete('/apartments/5783e20754b4f0f9cc9788cd')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.id).to.equal('5783e20754b4f0f9cc9788cd');
        done();
      });
    });

    it('should NOT delete an apartment - does not exist', (done) => {
      request(app)
      .delete('/apartments/01234567890123456789abcd')
      .end((err2, rsp) => {
        expect(err2).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.equal('id not found');
        done();
      });
    });
    it('should NOT delete an apartment - bad id', (done) => {
      request(app)
      .delete('/apartments/apt1')
      .end((err2, rsp) => {
        expect(err2).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.contain('"id" with value "apt1" fails to match the required pattern');
        done();
      });
    });
  });
  describe('lease /apartments', () => {
    it.only('should lease apartment by apartment & renter id', (done) => {
      request(app)
      .put('/apartments/5783e20754b4f0f9cc9788cd/lease')
      .send({ renter_id: '5783e34564b4f0f9cc9788cd' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        done();
      });
    });
  });
});
