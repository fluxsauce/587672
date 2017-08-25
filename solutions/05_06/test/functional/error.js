const chai = require('chai');
const chaiHttp = require('chai-http');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const logger = require('morgan');

chai.use(chaiHttp);

const should = chai.should();

describe('app.js', function() {
  // Backup.
  const env = process.env['NODE_ENV'];

  let app;
  let loggerStub;

  afterEach(function() {
    loggerStub.restore();
    process.env['NODE_ENV'] = env;
  });

  context('errors', function() {
    it('should return a 404 for a missing page in production', function(done) {
      loggerStub = sinon
        .stub(logger, 'morgan')
        .returns(function(req, res, next) {
          next();
        });

      process.env['NODE_ENV'] = 'production';
      app = proxyquire('../../app', {
        morgan: loggerStub
      });

      chai.request(app)
        .get('/bananas')
        .end(function(err, res) {
          res.should.have.status(404);
          res.text.should.not.contain('app.js');
          done();
        });
    });

    it('should return a 404 for a missing page in development with a stacktrace', function(done) {
      loggerStub = sinon
        .stub(logger, 'morgan')
        .returns(function(req, res, next) {
          next();
        });

      process.env['NODE_ENV'] = 'development';
      app = proxyquire('../../app', {
        morgan: loggerStub
      });

      chai.request(app)
        .get('/bananas')
        .end(function(err, res) {
          res.should.have.status(404);
          res.text.should.contain('app.js');
          done();
        });
    });
  });
});
