'use strict';

let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');
let PubSub = require('@superbalist/js-pubsub');
let PubSubAdapterInterface = PubSub.PubSubAdapterInterface;
let PubSubConnectionFactory = require('../src/PubSubConnectionFactory');
let PubSubManager = require('../src/PubSubManager');

describe('PubSubManagerTest', () => {
  describe('construct instance', () => {
    it('should set the factory property', () => {
      let factory = sinon.createStubInstance(PubSubConnectionFactory);
      let config = {};
      let manager = new PubSubManager(factory, config);
      expect(manager.factory).to.equal(factory);
    });

    it('should set the config property', () => {
      let factory = sinon.createStubInstance(PubSubConnectionFactory);
      let config = {};
      let manager = new PubSubManager(factory, config);
      expect(manager.config).to.equal(config);
    });

    it('should set the connections property to an empty object', () => {
      let factory = sinon.createStubInstance(PubSubConnectionFactory);
      let config = {};
      let manager = new PubSubManager(factory, config);
      expect(manager.connections).to.be.empty;
    });

    it('should set the extensions property to an empty object', () => {
      let factory = sinon.createStubInstance(PubSubConnectionFactory);
      let config = {};
      let manager = new PubSubManager(factory, config);
      expect(manager.extensions).to.be.empty;
    });
  });

  describe('connection', () => {
    it('should return the default connection when no connection name is given', () => {
      let adapter = sinon.createStubInstance(PubSubAdapterInterface);

      let factory = sinon.createStubInstance(PubSubConnectionFactory);
      factory.make = sinon.stub()
        .returns(adapter);

      let config = {
        'default': '/dev/null',
        'connections': {
          '/dev/null': {
            'driver': '/dev/null',
          },
        },
      };

      let manager = new PubSubManager(factory, config);

      let connection = manager.connection();

      expect(connection).to.equal(adapter);

      sinon.assert.calledOnce(factory.make);
      sinon.assert.calledWith(factory.make, '/dev/null', config.connections['/dev/null']);
    });

    it('should return a connection for the given name', () => {
      let adapter = sinon.createStubInstance(PubSubAdapterInterface);

      let factory = sinon.createStubInstance(PubSubConnectionFactory);
      factory.make = sinon.stub()
        .returns(adapter);

      let config = {
        'default': '/dev/null',
        'connections': {
          '/dev/null': {
            'driver': '/dev/null',
          },
          'my_connection': {
            'driver': 'my_driver',
          },
        },
      };

      let manager = new PubSubManager(factory, config);

      let connection = manager.connection('my_connection');

      expect(connection).to.equal(adapter);

      sinon.assert.calledOnce(factory.make);
      sinon.assert.calledWith(factory.make, 'my_driver', config.connections['my_connection']);
    });

    it('should add the connection to the connections object', () => {
      let adapter = sinon.createStubInstance(PubSubAdapterInterface);

      let factory = sinon.createStubInstance(PubSubConnectionFactory);
      factory.make = sinon.stub()
        .returns(adapter);

      let config = {
        'default': '/dev/null',
        'connections': {
          '/dev/null': {
            'driver': '/dev/null',
          },
        },
      };

      let manager = new PubSubManager(factory, config);

      expect(manager.connections).to.be.empty;

      manager.connection('/dev/null');

      expect(manager.connections).to.have.all.keys(['/dev/null']);
      expect(manager.connections['/dev/null']).to.equal(adapter);
    });

    it('should throw an exception when an invalid connection name is given', () => {
      let factory = sinon.createStubInstance(PubSubConnectionFactory);

      let config = {
        'default': '/dev/null',
        'connections': {
          '/dev/null': {
            'driver': '/dev/null',
          },
        },
      };

      let manager = new PubSubManager(factory, config);

      expect(() => manager.connection('my_connection')).to.throw(
        Error,
        'The pub-sub connection [my_connection] is not configured.'
      );
    });

    it('should throw an exception when the connection config is missing a driver property', () => {
      let factory = sinon.createStubInstance(PubSubConnectionFactory);

      let config = {
        'default': '/dev/null',
        'connections': {
          '/dev/null': {},
        },
      };

      let manager = new PubSubManager(factory, config);

      expect(() => manager.connection('/dev/null')).to.throw(
        Error,
        'The pub-sub connection [/dev/null] is missing a "driver" config var.'
      );
    });

    it('should re-use an existing connection if the connection has already been established', () => {
      let adapter = sinon.createStubInstance(PubSubAdapterInterface);

      let factory = sinon.createStubInstance(PubSubConnectionFactory);
      factory.make = sinon.stub()
        .returns(adapter);

      let config = {
        'default': '/dev/null',
        'connections': {
          '/dev/null': {
            'driver': '/dev/null',
          },
        },
      };

      let manager = new PubSubManager(factory, config);

      let connection1 = manager.connection();

      expect(connection1).to.equal(adapter);

      let connection2 = manager.connection();

      expect(connection2).to.equal(adapter);

      expect(connection1).to.equal(connection2);

      sinon.assert.calledOnce(factory.make);
      sinon.assert.calledWith(factory.make, '/dev/null', config.connections['/dev/null']);
    });

    it('should first try create a connection from an extension before using the factory', () => {
      let factory = sinon.createStubInstance(PubSubConnectionFactory);
      factory.make = sinon.stub();

      let config = {
        'default': '/dev/null',
        'connections': {
          '/dev/null': {
            'driver': '/dev/null',
          },
          'my_connection': {
            'bleh': 'blah',
          },
        },
      };

      let manager = new PubSubManager(factory, config);

      let adapter = sinon.createStubInstance(PubSubAdapterInterface);
      let resolver = sinon.stub()
        .returns(adapter);

      manager.extend('my_connection', resolver);

      let connection = manager.connection('my_connection');

      expect(connection).to.equal(adapter);

      manager.connection('my_connection');

      sinon.assert.notCalled(factory.make);
      sinon.assert.calledOnce(resolver);
      sinon.assert.calledWith(resolver, config.connections.my_connection);
    });
  });

  describe('getDefaultConnection', () => {
    it('should return the default connection name from the config', () => {
      let factory = sinon.createStubInstance(PubSubConnectionFactory);
      let config = {
        'default': '/dev/null',
      };
      let manager = new PubSubManager(factory, config);
      expect(manager.getDefaultConnection()).to.equal('/dev/null');
    });
  });

  describe('setDefaultConnection', () => {
    it('should update the default connection name in the config', () => {
      let factory = sinon.createStubInstance(PubSubConnectionFactory);
      let config = {
        'default': '/dev/null',
      };
      let manager = new PubSubManager(factory, config);
      expect(manager.getDefaultConnection()).to.equal('/dev/null');
      manager.setDefaultConnection('gcloud');
      expect(manager.getDefaultConnection()).to.equal('gcloud');
    });
  });

  describe('extend', () => {
    it('should add the resolver to the extensions object', () => {
      let factory = sinon.createStubInstance(PubSubConnectionFactory);
      let config = {};
      let manager = new PubSubManager(factory, config);

      expect(manager.extensions).to.be.empty;

      let resolver = sinon.spy();

      manager.extend('my_resolver', resolver);

      expect(manager.extensions).to.have.all.keys(['my_resolver']);
      expect(manager.extensions['my_resolver']).to.equal(resolver);
    });
  });
});
