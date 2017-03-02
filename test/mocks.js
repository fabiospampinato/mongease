
/* MOCKS */

function noop () {}

const firstName = 'First';
const firstConfig = {
  schema: {
    _id: Number,
    first: Boolean
  },
  index: {},
  query: {
    firstQuery: noop
  },
  statics: {
    firstStatic: noop
  },
  methods: {
    firstMethod: noop
  },
  virtuals: {
    firstVirtual: {
      get () { return 'get'; },
      set () { return 'set'; }
    }
  },
  plugins: [noop]
};

const secondName = 'Second';
const secondConfig = {
  schema: {
    _id: Number,
    second: Boolean
  }
};

/* EXPORT */

module.exports = {noop, firstName, firstConfig, secondName, secondConfig};
