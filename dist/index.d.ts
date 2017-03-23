declare const Mongease: {
    _parsed: {};
    _plugins: Function[];
    get(name?: string | undefined, sub?: string | undefined): any;
    getConfigs(): {}[];
    getConfig(name: string): {};
    getSchemas(): any[];
    getSchema(name: string): any;
    getModels(): any[];
    getModel(name: string): any;
    set(name: any, sub?: any, value?: any): any;
    setConfig(name: string, config: {}): {};
    setSchema(name: string, Schema: any): any;
    setModel(name: string, model: Function): any;
    reset(): any;
    plugin(plugin: Function | Function[]): any;
    make(name: string, config: {}): {
        schema: any;
        model: any;
    };
    makers: {
        order: string[];
        schema(name: string, schema: {}, plain: {}): any;
        index(name: string, indexes: {}): any;
        plugins(name: string, plugins: any[]): any;
        query(name: string, queries: {}): any;
        statics(name: string, statics: {}): any;
        methods(name: string, methods: {}): any;
        virtuals(name: string, virtuals: {}): any;
        model(name: string): any;
    };
};
export default Mongease;
