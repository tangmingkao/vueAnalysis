export function _proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[data][key];
        },
        set(newValue) {
            vm[data][key] = newValue;
        }
    });
}
export function defineProperty(target, key, value) {
    Object.defineProperty(target, key, {
        enumerable: false, // 不能被枚举，不能被循环出来
        configurable: false,
        value
    });
}

export const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed'
];
let strats = {};
strats.data = function (parentVal, childValue) {
    return childValue; // 这里应该有合并data的策略
}
strats.computed = function () {

};
strats.watch = function () {

};
//生命周期的合并
function mergeHook(parentVal, childVal) {
    if (childVal) {
        if (parentVal) {
            return parentVal.concat(childVal); //父亲和而儿子进行合并
        } else {
            return [childVal]
        }
    } else {
        //不合并啦采用父亲的
        return parentVal;
    }

}
LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook;
});

export function mergeOptions(parent, child) {
    //遍历父亲 可能事父亲有 儿子没有
    let options = {};
    //父亲儿子都有
    for (let key in parent) {
        mergeField(key);
    }

    //儿子有 父亲没有
    for (let key in child) {
        //将儿子多的赋予给父亲上
        if (!parent.hasOwnProperty(key)) {
            mergeField(key)
        }
    }

    //合并字段 根据key不同的策略来进行合并
    function mergeField(key) {
        //根据key 不同的策略来进行合并
        if (strats[key]) {
            options[key] = strats[key](parent[key], child[key]);
        } else {
            //todo 默认合并
            options[key] = child[key]
        }
    }

    return options;

}