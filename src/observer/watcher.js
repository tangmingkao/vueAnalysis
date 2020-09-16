import {
    pushTarget,
    popTarget
} from "./dep";
import {
    nextTick
} from "../utils/index";

let id = 0;
class Watcher {
    constructor(vm, exprOrFn, cb, options) {
        this.vm = vm;
        this.exprOrFn = exprOrFn;
        this.cb = cb;
        this.options = options;
        this.id = id++;
        this.deps = []; // watcher记录多个dep
        this.depsId = new Set();
        if (typeof exprOrFn == 'function') {
            this.getter = exprOrFn;
        }
        //默认调用get方法进行渲染
        this.get();
    }
    get() {
        pushTarget(this); //this是当前】的watcher实例
        this.getter(); //调用exprOrFn 渲染页面 render方法
        popTarget();
    }
    run() {
        this.get();
    }
    update() {
        //这里不要每次都调用get方法，get方法会每次重新渲染页面
        // this.get();
        //缓存watcher
        queueWatcher(this);

        // console.log(this.id)
    }
    addDep(dep) {
        let id = dep.id;
        if (!this.depsId.has(id)) {
            this.deps.push(dep);
            this.depsId.add(id);
            dep.addSub(this);
        }
    }
}

//将需要批量更新的watcher 存在一个队列中，稍后让watcher执行
let queue = [];
let has = {};
let pending = false;

function flushSchedulerQueue() {
    queue.forEach(watcher => {
        watcher.run();
        watcher.cb();
    });
    //清空watcher队列为啦下次使用
    queue = [];
    //清空标示对象
    has = {};
    pending = false;
}

function queueWatcher(watcher) {
    // console.log(watcher.id);
    const id = watcher.id;
    //利用id对watcher去重
    if (!has[id]) {
        queue.push(watcher);
        has[id] = true;
        //等待所有同步代码执行完毕后在执行
        if (!pending) {
            nextTick(flushSchedulerQueue);
            pending = true;
        }

    }
}

export default Watcher;

// 在数据劫持的时候，定义defineProperty的时候，给每个属性都添加一个dep

// 1. 把渲染watcher放到Dep.target属性上
// 2. 开始渲染 取值的时候会调用get方法，需要让这个属性的dep 存储当前的watcher
// 3. 页面上所需要的属性都会将这个watcher存在自己的dep中
// 4. 属性更新 重新调用渲染逻辑 通知自己存储的watcher去更新