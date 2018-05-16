/**
 * server.test
 * Created by dcorns on 5/10/18
 * Copyright © 2018 Dale Corns
 * MIT Licensed
 * start service container before running test (docker run -p 80:8080 -d health-first-email-token-microservice)
 */
'use strict';
const chai = require('chai');
const expect = require('chai').expect;
const {exec} = require('child_process');

chai.use(require('chai-http'));

describe('service.js', () => {
  it('respond with failure for invalid input', () => {
    return chai.request('http://localhost')
      .get('/token')
      .then(res => {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal('failure');
      });
    return chai.request('http://localhost')
      .get('/validate/3434h2')
      .then(res => {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal('failure');
      });
  });
  describe('/token/',() => {
    const jwt = require('jwt-simple');
    it('returns a valid JWT', () => {
      return chai.request('http://localhost')
        .get('/token/')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal('success');
          expect(res.body.token).to.be.a('string');
          const payload = jwt.decode(res.body.token,'the big secret!',false,'HS512');
          expect(payload).to.be.an('object');
          expect(payload.iss).to.equal('healthfirst');
          expect(payload.exp).to.be.a('number');
          expect(payload.iat).to.be.a('number');
          expect(payload.email).to.equal('');
        });
    });
    it('stores email in the JWT payload when provided', () => {
      return chai.request('http://localhost')
        .get('/token/myemail@gmail.com')
        .then(res => {
          const payload = jwt.decode(res.body.token,'the big secret!',false,'HS512');
          expect(payload).to.be.an('object');
          expect(payload.iss).to.equal('healthfirst');
          expect(payload.exp).to.be.a('number');
          expect(payload.iat).to.be.a('number');
          expect(payload.email).to.equal('myemail@gmail.com');
        });
    });
    it('stores other data in the JWT payload when provided', () => {
      return chai.request('http://localhost')
        .get('/token/blabla')
        .then(res => {
          const payload = jwt.decode(res.body.token,'the big secret!',false,'HS512');
          expect(payload).to.be.an('object');
          expect(payload.iss).to.equal('healthfirst');
          expect(payload.exp).to.be.a('number');
          expect(payload.iat).to.be.a('number');
          expect(payload.email).to.equal('blabla');
        });
    });
  });
  describe('/validate/',() => {
    const jwt = require('jwt-simple');
    const testJwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJoZWFsdGhmaXJzdCIsImV4cCI6MTUyNjAyMjM2MTcxNCwiaWF0IjoxNTI2MDA3NzkwODcyLCJlbWFpbCI6Im15ZW1haWxAZ21haWwuY29tIn0.2FLsOOnFkAmu0PC-MFpr_NxvcodpDzbSBMvuv2EAEz1wcAmSuxGH9e4p96q4JLtbKuzBnAAb3PnUNhGIXgwBNQ';
    it('returns failed for invalid input', () => {
      return chai.request('http://localhost')
        .get('/validate/')
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal('failure');
        });
    });
    it('returns the JWT payload for valid input', () => {
      return chai.request('http://localhost')
        .get('/validate/'+testJwt)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal('success');
          expect(res.body.email).to.equal('myemail@gmail.com');
          expect(res.body.iss).to.equal('healthfirst');
          expect(res.body.exp).to.be.a('number');
          expect(res.body.iat).to.be.a('number');
        });
    });
  });
});