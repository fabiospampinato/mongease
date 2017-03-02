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
        if (!Schema)
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
            var options = plain['options'], needsId = !schema.hasOwnProperty('_id') && (!options || options._id !== false), newSchema = needsId ? _.extend({}, schema, { _id: mongoose.Schema.Types.ObjectId }) : schema, Schema = new mongoose.Schema(newSchema, options);
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
            var Model;
            if (!mongoose.model) {
                Model = function () { };
                Model['modelName'] = name; // For better compatibility
            }
            else {
                var Schema = Mongease.getSchema(name);
                Model = mongoose.model(name, Schema);
            }
            return Mongease.setModel(name, Model);
        }
    }
};
/* EXPORT */
exports.default = Mongease;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsWUFBWTs7O0FBRVosMEJBQTRCO0FBQzVCLG1DQUFxQztBQUVyQyxjQUFjO0FBRWQsSUFBTSxRQUFRLEdBQUc7SUFFZixlQUFlO0lBRWYsT0FBTyxFQUFFLEVBQUU7SUFDWCxRQUFRLEVBQUUsRUFBZ0I7SUFFMUIsU0FBUztJQUVULEdBQUcsRUFBSCxVQUFNLElBQWEsRUFBRSxHQUFZO1FBRS9CLEVBQUUsQ0FBQyxDQUFFLElBQUssQ0FBQztZQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFHLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBRSxDQUFDO1FBRXhFLEVBQUUsQ0FBQyxDQUFFLEdBQUksQ0FBQztZQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFHLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFFLENBQUM7UUFFbEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7SUFFMUIsQ0FBQztJQUVELFVBQVUsRUFBVjtRQUVFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFHLFNBQVMsRUFBRSxRQUFRLENBQUUsQ0FBQztJQUU5QyxDQUFDO0lBRUQsU0FBUyxFQUFULFVBQVksSUFBWTtRQUV0QixJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFHLElBQUksRUFBRSxRQUFRLENBQUUsQ0FBQztRQUUvQyxFQUFFLENBQUMsQ0FBRSxDQUFDLE1BQU8sQ0FBQztZQUFDLE1BQU0sSUFBSSxLQUFLLENBQUcsb0NBQW9DLENBQUUsQ0FBQztRQUV4RSxNQUFNLENBQUMsTUFBTSxDQUFDO0lBRWhCLENBQUM7SUFFRCxVQUFVLEVBQVY7UUFFRSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBRyxTQUFT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