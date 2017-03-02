/* IMPORT */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var mongoose = require("mongoose");
/* MONGEASE */
var Mongease = {
    /* VARIABLES */
    _parsed: {},
    _plugins: [],
    /* GET */
    get: function (name, sub) {
        if (name)
            return _.get(Mongease._parsed, sub ? [name, sub] : name);
        if (sub)
            return _.map(Mongease._parsed, sub);
        return Mongease._parsed;
    },
    getConfigs: function () {
        return Mongease.get(undefined, 'config');
    },
    getConfig: function (name) {
        var config = Mongease.get(name, 'config');
        if (!config)
            throw new Error('[mongease] Configuration not found');
        return config;
    },
    getSchemas: function () {
        return Mongease.get(undefined, 'schema');
    },
    getSchema: function (name) {
        var Schema = Mongease.get(name, 'schema');
        if (!(Schema instanceof mongoose.Schema))
            throw new Error('[mongease] Schema not found');
        return Schema;
    },
    getModels: function () {
        return Mongease.get(undefined, 'model');
    },
    getModel: function (name) {
        var model = Mongease.get(name, 'model');
        if (!_.isFunction(model))
            throw new Error('[mongease] Model not found');
        return model;
    },
    /* SET */
    set: function (name, sub, value) {
        if (!sub)
            return Mongease._parsed = name;
        if (_.isUndefined(value)) {
            value = sub;
            sub = undefined;
        }
        return _.set(Mongease._parsed, _.isUndefined(sub) ? name : [name, sub], value);
    },
    setConfig: function (name, config) {
        return Mongease.set(name, 'config', config);
    },
    setSchema: function (name, Schema) {
        return Mongease.set(name, 'schema', Schema);
    },
    setModel: function (name, model) {
        return Mongease.set(name, 'model', model);
    },
    /* RESET */
    reset: function () {
        Mongease.set({});
        return Mongease;
    },
    /* PLUGIN */
    plugin: function (plugin) {
        Mongease._plugins = Mongease._plugins.concat(_.castArray(plugin));
        return Mongease;
    },
    /* MAKE */
    make: function (name, config) {
        if (!config.hasOwnProperty('schema'))
            throw new Error('[mongease] The configuration must provide a schema');
        for (var _i = 0, _a = Mongease.makers.order; _i < _a.length; _i++) {
            var maker = _a[_i];
            if (!config.hasOwnProperty(maker))
                continue;
            Mongease.makers[maker](name, config[maker], config);
        }
        var schema = Mongease.getSchema(name), model = Mongease.makers.model(name);
        for (var _b = 0, _c = Mongease._plugins; _b < _c.length; _b++) {
            var plugin = _c[_b];
            plugin(name, config);
        }
        return { schema: schema, model: model };
    },
    makers: {
        order: ['schema', 'index', 'plugins', 'query', 'statics', 'methods', 'virtuals'],
        schema: function (name, schema, plain) {
            Mongease.setConfig(name, plain);
            var Schema = new mongoose.Schema(schema, plain['options']);
            return Mongease.setSchema(name, Schema);
        },
        index: function (name, indexes) {
            var Schema = Mongease.getSchema(name);
            Schema.index(indexes);
            return Schema;
        },
        plugins: function (name, plugins) {
            var Schema = Mongease.getSchema(name);
            for (var _i = 0, plugins_1 = plugins; _i < plugins_1.length; _i++) {
                var plugin = plugins_1[_i];
                plugin = _.castArray(plugin);
                Schema.plugin(plugin[0], plugin[1]);
            }
            return Schema;
        },
        query: function (name, queries) {
            var Schema = Mongease.getSchema(name);
            _.extend(Schema['query'], queries);
            return Schema;
        },
        statics: function (name, statics) {
            var Schema = Mongease.getSchema(name);
            _.extend(Schema.statics, statics);
            return Schema;
        },
        methods: function (name, methods) {
            var Schema = Mongease.getSchema(name);
            _.extend(Schema.methods, methods);
            return Schema;
        },
        virtuals: function (name, virtuals) {
            var Schema = Mongease.getSchema(name);
            for (var virtual in virtuals) {
                if (!virtuals.hasOwnProperty(virtual))
                    continue;
                for (var _i = 0, _a = ['get', 'set']; _i < _a.length; _i++) {
                    var kind = _a[_i];
                    if (!virtuals[virtual].hasOwnProperty(kind))
                        continue;
                    Schema.virtual(virtual)[kind](virtuals[virtual]);
                }
            }
            return Schema;
        },
        model: function (name) {
            var Schema = Mongease.getSchema(name), Model = mongoose.model(name, Schema);
            return Mongease.setModel(name, Model);
        }
    }
};
/* EXPORT */
exports.default = Mongease;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsWUFBWTs7O0FBRVosMEJBQTRCO0FBQzVCLG1DQUFxQztBQUVyQyxjQUFjO0FBRWQsSUFBTSxRQUFRLEdBQUc7SUFFZixlQUFlO0lBRWYsT0FBTyxFQUFFLEVBQUU7SUFDWCxRQUFRLEVBQUUsRUFBZ0I7SUFFMUIsU0FBUztJQUVULEdBQUcsRUFBSCxVQUFNLElBQWEsRUFBRSxHQUFZO1FBRS9CLEVBQUUsQ0FBQyxDQUFFLElBQUssQ0FBQztZQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFHLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBRSxDQUFDO1FBRXhFLEVBQUUsQ0FBQyxDQUFFLEdBQUksQ0FBQztZQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFHLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFFLENBQUM7UUFFbEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7SUFFMUIsQ0FBQztJQUVELFVBQVUsRUFBVjtRQUVFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFHLFNBQVMsRUFBRSxRQUFRLENBQUUsQ0FBQztJQUU5QyxDQUFDO0lBRUQsU0FBUyxFQUFULFVBQVksSUFBWTtRQUV0QixJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFHLElBQUksRUFBRSxRQUFRLENBQUUsQ0FBQztRQUUvQyxFQUFFLENBQUMsQ0FBRSxDQUFDLE1BQU8sQ0FBQztZQUFDLE1BQU0sSUFBSSxLQUFLLENBQUcsb0NBQW9DLENBQUUsQ0FBQztRQUV4RSxNQUFNLENBQUMsTUFBTSxDQUFDO0lBRWhCLENBQUM7SUFFRCxVQUFVLEVBQVY7UUFFRSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBRyxTQUFT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