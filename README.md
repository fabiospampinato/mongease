# Mongease

![Issues](https://img.shields.io/github/issues/fabiospampinato/mongease.svg)
[![NPM version](https://img.shields.io/npm/v/mongease.svg)](https://www.npmjs.com/package/mongease)

Tiny wrapper around Mongoose for easier creation of schemas and models. Supports plugins.

## Install

```shell
$ npm install --save mongease
```

## Usage

```js
import Mongease from 'mongease';
import someMongoosePlugin from 'some-mongoose-plugin';
import someMongeasePlugin from 'some-mongease-plugin';

Mongease.plugin ( someMongeasePlugin );

const {schema, model} = Mongease.make ( 'Book', {
  schema: {
    title: String,
    category: Number,
    read: Boolean
  },
  options: { autoindex: false },
  index: { title: 1 },
  plugins: [someMongoosePlugin],
  query: {
    onlyPopular () {}
  },
  statics: {
    getFantasy () {}
  },
  methods: {
    markAsRead () {}
  },
  virtuals: {
    method: {
      get () {},
      set () {}
    }
  }
});
```

## API

### `.getConfigs (): {}[]`

Returns all the parsed configurations.

### `.getConfig ( name: string ): {}`

Returns a configuration by name.

### `.getSchemas (): mongoose.Schema[]`

Returns all the created schemas.

### `.getSchema ( name: string ): mongoose.Schema`

Returns a schema by name.

### `.getModels (): Function[]`

Returns all the created models.

### `.getModel ( name: string ): Function`

Returns a model by name.

### `.setConfig ( name: string, config: {} ): {}`

Associate a configuration to a name.

### `.setSchema ( name: string, schema: mongoose.Schema ): mongoose.Schema`

Associate a schema to a name.

### `.setModel ( name: string, model: Function ): Function`

Associate a model to a name.

### `.reset ()`

Removes all the setted associations.

### `.plugin ( plugin: Function | Function[] )`

Adds a plugin, or an array of plugins, to the list of those that will be called after making a configuration.

### `.make ( name: string, config: {} ): { schema: mongoose.Schema, model: Function }`

Creates a schema and a model and returns them. It also calls each registered plugin with the same arguments.

## Related

- [mongoose-to-graphql](https://github.com/fabiospampinato/mongoose-to-graphql) - Converts a Mongoose schema to its GraphQL representation.
- [mongease-graphql](https://github.com/fabiospampinato/mongease-graphql) - Mongease plugin for adding support to GraphQL schemas creation.
- [mongease-graphql-builder](https://github.com/fabiospampinato/mongease-graphql-builder) - Module for auto-generating simple GraphQL queries from Mongease descriptions.

## License

MIT © Fabio Spampinato
