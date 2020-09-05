import {
    pushTarget,
    popTarget
} from "./dep";

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
    update() {
        this.getter();
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

export default Watcher;

// 在数据劫持的时候，定义defineProperty的时候，给每个属性都添加一个dep

// 1. 把渲染watcher放到Dep.target属性上
// 2. 开始渲染 取值的时候会调用get方法，需要让这个属性的dep 存储当前的watcher
// 3. 页面上所需要的属性都会将这个watcher存在自己的dep中
// 4. 属性更新 重新调用渲染逻辑 通知自己存储的watcher去更新