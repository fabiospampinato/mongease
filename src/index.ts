
/* IMPORT */

import castArray = require ( 'lodash/castArray' );
import extend = require ( 'lodash/extend' );
import get = require ( 'lodash/get' );
import isFunction = require ( 'lodash/isFunction' );
import isUndefined = require ( 'lodash/isUndefined' );
import map = require ( 'lodash/map' );
import set = require ( 'lodash/set' );
import * as mongoose from 'mongoose';

/* MONGEASE */

//TODO: Auto creation of resolvers from methods (probably requires a babel transform)
//TODO: add support for all the missing abilities of plain mongoose decorators
//      - hooks
//      - get properties added by plugins
//      - model.discriminator

const Mongease = {

  /* VARIABLES */

  _parsed: {},
  _plugins: [] as Function[],

  /* GET */

  get ( name?: string, sub?: string ): any {

    if ( name ) return get ( Mongease._parsed, sub ? [name, sub] : name );

    if ( sub ) return map ( Mongease._parsed, sub );

    return Mongease._parsed;

  },

  getConfigs (): {}[] {

    return Mongease.get ( undefined, 'config' );

  },

  getConfig ( name: string ): {} {

    const config = Mongease.get ( name, 'config' );

    if ( !config ) throw new Error ( '[mongease] Configuration not found' );

    return config;

  },

  getSchemas (): mongoose.Schema[] {

    return Mongease.get ( undefined, 'schema' );

  },

  getSchema ( name: string ): mongoose.Schema {

    const Schema = Mongease.get ( name, 'schema' );

    if ( !Schema ) throw new Error ( '[mongease] Schema not found' );

    return Schema;

  },

  getModels (): any[] {

    return Mongease.get ( undefined, 'model' );

  },

  getModel ( name: string ): any {

    const model = Mongease.get ( name, 'model' );

    if ( !isFunction ( model ) ) throw new Error ( '[mongease] Model not found' );

    return model;

  },

  /* SET */

  set ( name, sub?, value? ): any {

    if ( !sub ) return Mongease._parsed = name;

    if ( isUndefined ( value ) ) {

      value = sub;
      sub = undefined;

    }

    set ( Mongease._parsed, isUndefined ( sub ) ? name : [name, sub], value );

    return value;

  },

  setConfig ( name: string, config: {} ): {} {

    return Mongease.set ( name, 'config', config );

  },

  setSchema ( name: string, Schema: mongoose.Schema ): mongoose.Schema {

    return Mongease.set ( name, 'schema', Schema );

  },

  setModel ( name: string, model: Function ): any {

    return Mongease.set ( name, 'model', model );

  },

  /* RESET */

  reset () {

    Mongease.set ( {} );

    return Mongease;

  },

  /* PLUGIN */

  plugin ( plugin: Function | Function[] ) {

    Mongease._plugins = Mongease._plugins.concat ( castArray ( plugin ) );

    return Mongease;

  },

  /* MAKE */

  make ( name: string, config: {} ): { schema: mongoose.Schema, model: any } {

    if ( !config.hasOwnProperty ( 'schema' ) ) throw new Error ( '[mongease] The configuration must provide a schema' );

    for ( let maker of Mongease.makers.order ) {

      if ( !config.hasOwnProperty ( maker ) ) continue;

      Mongease.makers[maker]( name, config[maker], config );

    }

    const schema = Mongease.getSchema ( name ),
          model = Mongease.makers.model ( name );

    for ( let plugin of Mongease._plugins ) {

      plugin ( name, config );

    }

    return {schema, model};

  },

  makers: {

    order: ['schema', 'index', 'plugins', 'query', 'statics', 'methods', 'virtuals'],

    schema ( name: string, schema: {}, plain: {} ): mongoose.Schema {

      Mongease.setConfig ( name, plain );

      const options = plain['options'],
            needsId = !schema.hasOwnProperty ( '_id' ) && ( !options || options._id !== false );

      if ( needsId ) extend ( schema, { _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId () } } );

      const Schema = new mongoose.Schema ( schema, options );

      return Mongease.setSchema ( name, Schema );

    },

    index ( name: string, indexes: {} ): mongoose.Schema {

      const Schema = Mongease.getSchema ( name );

      Schema.index ( indexes );

      return Schema;

    },

    plugins ( name: string, plugins: any[] ): mongoose.Schema {

      const Schema = Mongease.getSchema ( name );

      for ( let plugin of plugins ) {

        plugin = castArray ( plugin );

        Schema.plugin ( plugin[0], plugin[1] );

      }

      return Schema;

    },

    query ( name: string, queries: {} ): mongoose.Schema {

      const Schema = Mongease.getSchema ( name );

      extend ( Schema['query'], queries );

      return Schema;

    },

    statics ( name: string, statics: {} ): mongoose.Schema {

      const Schema = Mongease.getSchema ( name );

      extend ( Schema.statics, statics );

      return Schema;

    },

    methods ( name: string, methods: {} ): mongoose.Schema {

      const Schema = Mongease.getSchema ( name );

      extend ( Schema.methods, methods );

      return Schema;

    },

    virtuals ( name: string, virtuals: {} ): mongoose.Schema {

      const Schema = Mongease.getSchema ( name );

      for ( let virtual in virtuals ) {

        if ( !virtuals.hasOwnProperty ( virtual ) ) continue;

        for ( let kind of ['get', 'set'] ) {

          if ( !virtuals[virtual].hasOwnProperty ( kind ) ) continue;

          Schema.virtual ( virtual )[kind]( virtuals[virtual] );

        }

      }

      return Schema;

    },

    model ( name: string ): any {

      const Schema = Mongease.getSchema ( name );

      let Model;

      if ( !mongoose.model ) { // Running in the browser, ensuring some degree of compatibility

        Model = function () {};
        Model['modelName'] = name;

        const config = Mongease.getConfig ( name );

        extend ( Model, config['statics'] );

      } else {

        Model = mongoose.model ( name, Schema );

      }

      return Mongease.setModel ( name, Model );

    }

  }

};

/* EXPORT */

export default Mongease;
