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
// strats.computed = function () {

// };
// strats.watch = function () {

// };
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

let callbacks = [];
let pending = false;

function flushCallbacks() {
    while (callbacks.length) {
        let cb = callbacks.pop();
        cb();
    }
    pending = false;

}
let timerFunc;
if (Promise) {
    timerFunc = () => {
        //异步处理更新
        Promise.resolve().then(flushCallbacks);
    };
} else if (MutationObserver) {
    //MutationObserver可以监控dom变化。变化完后是异步更新
    let observe = new MutationObserver(flushCallbacks);
    let textNode = document.createTextNode(1);
    observe.observe(textNode, {
        characterData: true
    });
    timerFunc = () => {
        textNode.textContent = 2;
    };
} else if (setImmediate) {
    timerFunc = () => {
        setImmediate(flushCallbacks);
    }
} else {
    timerFunc = () => {
        setTimeout(flushCallbacks, 0);
    }
}

//内部调用nextTick 用户也会调用 但是异步只需要一次
export function nextTick(cb) {
    callbacks.push(cb);
    //vue3中nextTick原理就是promise.then 没有做兼容
    //这个方法就是异步更新
    if (!pending) {
        timerFunc();
        pending = true;
    }

}