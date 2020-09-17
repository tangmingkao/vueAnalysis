import {
    observer
} from "./observer/index";
import {
    _proxy,
    nextTick
} from "./utils/index";
import Watcher from './observer/watcher';

export function initState (vm) {
    // console.log(vm);
    const opts = vm.$options;

    if (opts.props) {
        initProps(vm);
    }
    if (opts.methods) {
        initMathods(vm);
    }
    if (opts.data) {
        initData(vm);
    }
    if (opts.computed) {
        initComputed(vm);
    }
    if (opts.watch) {
        initWatch(vm);
    }

}

function initData (vm) {
    //初始化数据
    let data = vm.$options.data;
    data = typeof data == 'function' ? data.call(vm) : data;
    //将data挂载在vm上
    vm._data = data;
    // console.log(data);

    //代理，将vm取值代理到vm._data上取值
    for (let key in data) {
        _proxy(vm, '_data', key);
    }

    //数据的劫持方案 
    //对象: Object.defineProperty
    //数组: 函数劫持 切片式编程
    observer(data);
}

function initProps (vm) {
    //初始化属性
}

function initMathods (vm) {
    //初始化方法
}

function initComputed (vm) {
    //初始化计算属性
}

function initWatch (vm) {
    //初始化watch
    let watch = vm.$options.watch;
    console.log(watch);
    for (let key in watch) {
        let handler = watch[key]; //handler 可能是数组、字符串、对象、函数
        if (Array.isArray(handler)) { //可能是数组
            handler.forEach((handle) => {
                createWatcher(vm, key, handle);
            });
        } else { //字符串、对象、函数
            createWatcher(vm, key, handler);
        }
    }
}

function createWatcher (vm, exprOrFn, handler, options = {}) { //options 可以表示是否是用户
    if (typeof handler == 'object') {
        options = handler;
        handler = handler.handler; //是一个函数
    } else if (typeof handler == 'string') {
        handler = vm[handler]; //将实例的方法作为handler
    }
    // key handler 用户传入的选项
    return vm.$watch(exprOrFn, handler, options);
}

export function stateMixin (vm) {
    vm.prototype.$nextTick = function (cd) {
        nextTick(cb);
    };
    vm.prototype.$watch = function (exprOrFn, cb, options) {
        // console.log(exprOrFn, handler, options);

        //数据应该依赖这个watcher 数据变化后应该让watcher重新执行
        //必须用this不能用vm
        let watcher = new Watcher(this, exprOrFn, cb, { ...options, user: true });
        if (options.immediate) {
            //如果是immediate 需要立即执行
            cb();
        }
    };
}