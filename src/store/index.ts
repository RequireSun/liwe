import { observable } from 'mobx';

function isMap(obj: any): obj is Map<string, any> {
    return obj instanceof Map;
}

export default class Store {
    @observable schema: any;
    @observable beeLine: Map<string, any> = new Map();
    components: Map<string, any>;

    constructor({
        schema = {},
        components,
    }: {
        schema: any;
        components: { [key: string]: any; } | Map<string, any>
    }) {
        if (!isMap(components)) {
            components = new Map(Object.entries(components));
        }
        this.components = components as Map<string, any>;
        this.schema = schema;
    }
}
