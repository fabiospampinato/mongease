
/* IMPORT */

import * as _ from 'lodash';
import {describe} from 'ava-spec';
import callSpy from 'call-spy';
import Mongoose from 'mongoose';
import Mongease from '../dist';
import {noop, firstName, firstConfig, secondName, secondConfig} from './mocks';

/* MONGEASE */

describe ( 'Mongease', it => {

  it.beforeEach ( t => {

    Mongoose.models = {};
    Mongoose.modelSchemas = {};
    Mongease.reset ();

    t.context.M = _.cloneDeep ( Mongease );
    t.context.M.reset ();

    t.context.M.make ( firstName, firstConfig );
    t.context.M.make ( secondName, secondConfig );

  });

  describe ( 'get', it => {

    it ( 'Returns all data', t => {

      t.deepEqual ( Mongease._parsed, t.context.M.get () );

    });

    it ( 'Returns all component\'s data', t => {

      const data = t.context.M.get ( firstName );

      t.is ( data.config, t.context.M.getConfig ( firstName ) );
      t.is ( data.schema, t.context.M.getSchema ( firstName ) );
      t.is ( data.model, t.context.M.getModel ( firstName ) );

    });

    it ( 'Returns a component\'s data', t => {

      t.is ( t.context.M.get ( firstName, 'schema' ), t.context.M.getSchema ( firstName ) );

    });

  });

  describe ( 'getConfigs', it => {

    it ( 'Returns all configurations', t => {

      t.deepEqual ( [t.context.M.getConfig ( firstName ), t.context.M.getConfig ( secondName )], t.context.M.getConfigs () );

    });

  });

  describe ( 'getConfig', it => {

    it ( 'Returns a component\'s configuration', t => {

      t.deepEqual ( firstConfig, t.context.M.getConfig ( firstName ) );

    });

    it ( 'Throws an error if the sconfiguration was not found', t => {

      t.throws ( () => t.context.M.getConfig ( '__test__' ), /Configuration not found/ );

    });

  });

  describe ( 'getSchemas', it => {

    it ( 'Returns all schemas', t => {

      t.deepEqual ( [t.context.M.getSchema ( firstName ), t.context.M.getSchema ( secondName )], t.context.M.getSchemas () );

    });

  });

  describe ( 'getSchema', it => {

    it ( 'Returns a component\'s schema', t => {

      t.deepEqual ( firstConfig.schema, t.context.M.getSchema ( firstName ).obj );

    });

    it ( 'Throws an error if the schema was not found', t => {

      t.throws ( () => t.context.M.getSchema ( '__test__' ), /Schema not found/ );

    });

  });

  describe ( 'getModels', it => {

    it ( 'Returns all models', t => {

      t.deepEqual ( [t.context.M.getModel ( firstName ), t.context.M.getModel ( secondName )], t.context.M.getModels () );

    });

  });

  describe ( 'getModel', it => {

    it ( 'Returns a component\'s model', t => {

      const model = t.context.M.getModel ( firstName );

      t.true ( model instanceof Function );
      t.deepEqual ( firstConfig.schema, model.schema.obj );

    });

    it ( 'Throws an error if the model was not found', t => {

      t.throws ( () => t.context.M.getModel ( '__test__' ), /Model not found/ );

    });

  });

  describe ( 'set', it => {

    it ( 'Sets all data', t => {

      t.context.M.set ( true );

      t.true ( t.context.M.get () );

    });

    it ( 'Sets a component', t => {

      t.context.M.set ( firstName, true );

      t.true ( t.context.M.get ( firstName ) );

    });

    it ( 'Sets a component\'s data', t => {

      t.context.M.set ( firstName, '__test__', true );

      t.true ( t.context.M.get ( firstName, '__test__' ) );

    });

  });

  describe ( 'setConfig', it => {

    it ( 'Sets a component\'s configuration', t => {

      t.context.M.setConfig ( firstName, true );

      t.true ( t.context.M.getConfig ( firstName ) );

    });

  });

  describe ( 'setSchema', it => {

    it ( 'Sets a component\'s schema', t => {

      const schema = new Mongoose.Schema ({});

      t.context.M.setSchema ( firstName, schema );

      t.is ( t.context.M.getSchema ( firstName ), schema );

    });

  });

  describe ( 'setModel', it => {

    it ( 'Sets a component\'s model', t => {

      const schema = new Mongoose.Schema ({}),
            model = Mongoose.model ( '__test__', schema );

      t.context.M.setModel ( firstName, model );

      t.is ( t.context.M.getModel ( firstName ), model );

    });

  });

  describe ( 'reset', it => {

    it ( 'Resets all the data', t => {

      t.notDeepEqual ( t.context.M.get () );

      t.context.M.reset ();

      t.deepEqual ( t.context.M.get (), {} );

    });

  });

  describe ( 'plugin', it => {

    it ( 'Adds a plugin', t => {

      Mongease._plugins = [];

      t.context.M.plugin ( noop );

      t.deepEqual ( Mongease._plugins, [noop] );

    });

    it ( 'Adds an array of plugins', t => {

      Mongease._plugins = [];

      const plugins = [noop, noop];

      t.context.M.plugin ( plugins );

      t.deepEqual ( Mongease._plugins, plugins );

    });

  });

  describe ( 'make', it => {

    it ( 'Throws an error if no schema is provided', t => {

      t.throws ( () => t.context.M.make ( 'TestName', {} ), /The configuration must provide a schema/ );

    });

    it ( 'Calls each maker if their properties are in the config', t => {

      const props = Object.keys ( firstConfig ),
            results = {};

      for ( let maker of Mongease.makers.order ) {

        const result = {};

        results[maker] = result;

        Mongease.makers[maker] = callSpy ( Mongease.makers[maker], result );

      }

      t.context.M.make ( 'TestName', firstConfig );

      for ( let maker of Mongease.makers.order ) {

        t.is ( results[maker].called, props.includes ( maker ) );

      }

    });

    it ( 'Calls all the plugins', t => {

      Mongease._plugins = [];

      const name = 'TestName',
            config = { schema: {} },
            plugins = [noop, noop, noop],
            results = [];

      t.context.M.plugin ( plugins );

      for ( let i = 0, l = Mongease._plugins.length; i < l; i++ ) {

        const result = {};

        results.push ( result );

        Mongease._plugins[i] = callSpy ( Mongease._plugins[i], result );

      }

      t.is ( results.length, plugins.length );

      t.context.M.make ( name, config );

      for ( let result of results ) {

        t.true ( result.called );
        t.deepEqual ( result.args, [name, config] );

      }

    });

    //TODO: Maybe move the following tests to their own block

    it ( 'Instanciates and stores a schema', t => {

      t.notThrows ( () => t.context.M.getSchema ( firstName ) );

    });

    it.todo ( 'Sets the indexes' );

    it.todo ( 'Sets the plugins' );

    it ( 'Sets static methods', t => {

      const schema = t.context.M.getSchema ( firstName );

      for ( let name in firstConfig.statics ) {

        t.true ( name in schema.statics );

      }

    });

    it ( 'Sets query methods', t => {

      const schema = t.context.M.getSchema ( firstName );

      for ( let name in firstConfig.query ) {

        t.true ( name in schema.query );

      }

    });

    it ( 'Sets instance methods', t => {

      const schema = t.context.M.getSchema ( firstName );

      for ( let name in firstConfig.methods ) {

        t.true ( name in schema.methods );

      }

    });

    it ( 'Sets virtual methods', t => {

      const schema = t.context.M.getSchema ( firstName );

      for ( let name in firstConfig.virtuals ) {

        t.true ( name in schema.virtuals );

      }

    });

    it ( 'Instanciates and stores a model', t => {

      t.notThrows ( () => t.context.M.getModel ( firstName ) );

    });

  });

});
