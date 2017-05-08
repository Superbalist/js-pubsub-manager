'use strict';

let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');
let proxyquire = require('proxyquire');
let PubSub = require('@superbalist/js-pubsub');
let DevNullPubSubAdapter = PubSub.DevNullPubSubAdapter;
let LocalPubSubAdapter = PubSub.LocalPubSubAdapter;

// stub out required modules
let [redis, googleCloudPubSub] = (() => {
  let redis = {
    createClient: sinon.stub(),
  };

  let pubsub = sinon.stub();

  proxyquire('../src/PubSubConnectionFactory', {
    'redis': redis,
    '@google-cloud/pubsub': pubsub,
  });

  return [redis, pubsub];
})();

let PubSubConnectionFactory = require('../src/PubSubConnectionFactory');
let RedisPubSubAdapter = require('@superbalist/js-pubsub-redis');
let GoogleCloudPubSubAdapter = require('@superbalist/js-pubsub-google-cloud');

describe('PubSubConnectionFactory', () => {
  describe('make', () => {
    it('with "/dev/null" should return an instance of a DevNullPubSubAdapter', () => {
      let factory = new PubSubConnectionFactory();
      let connection = factory.make('/dev/null');
      expect(connection).to.be.an.instanceof(DevNullPubSubAdapter);
    });

    it('with "local" should return an instance of a LocalPubSubAdapter', () => {
      let factory = new PubSubConnectionFactory();
      let connection = factory.make('local');
      expect(connection).to.be.an.instanceof(LocalPubSubAdapter);
    });

    it('with "redis" should return an instance of a RedisPubSubAdapter', () => {
      let factory = new PubSubConnectionFactory();
      let connection = factory.make('redis', {'hello': 'world'});

      expect(connection).to.be.an.instanceof(RedisPubSubAdapter);

      sinon.assert.calledOnce(redis.createClient);
      sinon.assert.calledWith(redis.createClient, {'hello': 'world'});
    });

    it('with "gcloud" should return an instance of a GoogleCloudPubSubAdapter', () => {
      let factory = new PubSubConnectionFactory();
      let config = {
        'project_id': 'ABC123',
        'key_file': 'my_key.json',
        'client_identifier': 'search',
        'auto_create_topics': false,
        'auto_create_subscriptions': false,
      };
      let connection = factory.make('gcloud', config);

      expect(connection).to.be.an.instanceof(GoogleCloudPubSubAdapter);
      expect(connection.clientIdentifier).to.equal('search');
      expect(connection.autoCreateTopics).to.be.false;
      expect(connection.autoCreateSubscriptions).to.be.false;

      sinon.assert.calledOnce(googleCloudPubSub);
      sinon.assert.calledWith(
        googleCloudPubSub, {
          'projectId': 'ABC123',
          'keyFilename': 'my_key.json',
        }
      );
    });

    it('should throw an exception if an invalid driver is given', () => {
      let factory = new PubSubConnectionFactory();

      expect(() => factory.make('my_custom_driver')).to.throw(
        Error,
        'The driver [my_custom_driver] is not supported.'
      );
    });
  });
});