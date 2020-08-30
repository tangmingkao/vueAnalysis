import {
    observer
} from "./observer/index.js";

export function initState(vm) {
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

function initData(vm) {
    //初始化数据
    let data = vm.$options.data;
    data = typeof data == 'function' ? data.call(vm) : data;
    //将data挂载在vm上
    vm._data = data;
    // console.log(data);
    //数据的劫持方案 
    //对象: Object.defineProperty
    //数组: 函数劫持 切片式编程
    observer(data);
}

function initProps(vm) {
    //初始化属性
}

function initMathods(vm) {
    //初始化方法
}

function initComputed(vm) {
    //初始化计算属性
}

function initWatch(vm) {
    //初始化watch
}