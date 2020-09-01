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
//函数劫持 -切片编程AOP
methods.forEach(method => {
    arrayMethods[methods] = function (...args) {
        console.log(args);
        const result = oldArrayProtoMethods[method].apply(this, args);
        let inserted;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
            case 'splice':
                inserted = args.slice(2);
            default:
                break;

        }
        if (inserted) {
            observeArray(inserted);
        }
    };
});