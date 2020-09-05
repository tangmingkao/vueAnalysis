let id = 0;

//依赖收集
class Dep {
    constructor() {
        this.subs = [];
        this.id = id++;
    }
    depend() {
        Dep.target.addDep(this);
        // this.subs.push(Dep.target);
    }
    notify() {
        this.subs.forEach(watch => {
            watch.update();
        });
    }
    addSub(watcher) {
        this.subs.push(watcher);
    }
}

export default Dep;

Dep.target = null;
export function pushTarget(watcher) {
    Dep.target = watcher;
}

export function popTarget() {
    Dep.target = null;
}

// 多对多的关系 一个属性有一个dep是用来收集watcher的
// dep 可以存多个watcher
// 一个watcher可以对应多个dep