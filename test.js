const assert = require('assert');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser')
const identifyConsumer = require('.');

const PORT = 13000;

function setup(middleware, routeArgs) {
  const app = express();
  app.use(bodyParser.json());
  app.use(middleware);
  app.get(...routeArgs);
  return app.listen(PORT);
}

const return200 = (req, res) => res.sendStatus(200);
const end =  () => { /* do nothing because the test relies on a callback */ }

describe('identify-consumer', () => {
  let server;
  afterEach(() => {
    server.close();
  });
  it('calls the provided callback with a query string param identifying the consumer', (done) => {
    const middleware = identifyConsumer({
      callback: (consumer) => {
        assert.equal(consumer, 'someone');
        done();
      },
    });
    server = setup(middleware, ['/here', return200]);
    request(server)
      .get('/here?consumer=someone')
      .expect(200, end);
  });
  it('calls the provided callback with a key on the body identifying the consumer', (done) => {
    const middleware = identifyConsumer({
      callback: (consumer) => {
        assert.equal(consumer, 'someone');
        done();
      },
    });
    server = setup(middleware, ['/here/:id', return200]);
    request(server)
      .post('/here/3')
      .send({ stuff: 'stuff', consumer: 'someone' })
      .expect(200, end);
  });
  it('copes when there is no callback', (done) => {
    const middleware = identifyConsumer({});
    server = setup([middleware], ['/here', return200]);
    request(server)
      .get('/here?consumer=someone')
      .expect(200, done);
  });
  it('calls the provided noConsumerCallback callback when there is no consumer', (done) => {
    const middleware = identifyConsumer({
      noConsumerCallback: () => {
        done();
      }
    });
    server = setup(middleware, ['/here', return200]);
    request(server)
      .get('/here')
      .expect(200, end);
  });
  it('calls the provided noConsumerCallback callback with the original url of the request', (done) => {
    const middleware = identifyConsumer({
      noConsumerCallback: (originalUrl) => {
        assert.equal(originalUrl, '/here');
        done();
      },
    });
    server = setup(middleware, ['/here', return200]);
    request(server)
      .get('/here')
      .expect(200, end);
  });
  it('copes when there is no noConsumerCallback callback', (done) => {
    const middleware = identifyConsumer({});
    server = setup([middleware], ['/here', return200]);
    request(server)
      .get('/here')
      .expect(200, done);
  });
  it('400s when there is no consumer in strict mode', (done) => {
    const middleware = identifyConsumer({
      strict: true,
    });
    server = setup([middleware], ['/here', return200]);
    request(server)
      .get('/here')
      .expect(400, done);
  });
  it('copes when passed no options', (done) => {
    const middleware = identifyConsumer();
    server = setup([middleware], ['/here', return200]);
    request(server)
      .get('/here')
      .expect(200, done);
  });
  it('copes when there is no body', (done) => {
    const middleware = identifyConsumer();
    const app = express();
    app.use(middleware);
    app.get('/here', return200);
    server = app.listen(PORT);
    request(server)
      .get('/here')
      .expect(200, done);
  });
});
