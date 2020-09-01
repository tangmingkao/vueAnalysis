//拿到数组原型上的方法
let oldArrayProtoMethods = Array.prototype;
// Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。
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
        let ob = this.__ob__;
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
            ob.observeArray(inserted);
        }
        return result;
    };
});