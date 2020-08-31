let oldArrayProtoMethods = Array.prototype;
export let arrayMethods = Object.create(oldArrayProtoMethods);
let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
];

methods.forEach(method => {
    arrayMethods[methods] = function (...args) {
        const result = oldArrayProtoMethods[method].apply(this, args);
        let inserted;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
            case 'splice':
                inserted = args.slice(2)

        }
    };
});