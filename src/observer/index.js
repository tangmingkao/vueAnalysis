import {
    arrayMethods
} from "./array";
import {
    defineProperty
} from "../utils/index.js";
import Dep from "./dep";

class Observer {
    constructor(value) {
        this.dep = new Dep(); //对象和数组都加this.dep
        //将类Observer的this挂载在观测对象的__ob__上
        // Object.defineProperty(value, '___ob__', {
        //     enumerable: false,
        //     configurable: false,
        //     value: this,
        // });
        defineProperty(value, '__ob__', this);
        // console.log(value);
        //如果是数组，走数组重写的方法
        if (Array.isArray(value)) {
            // console.log(value)
            value.__proto__ = arrayMethods;
            this.observeArray(value);

        } else {
            //否则直接观测
            this.walk(value);
        }
    }
    observeArray (value) {
        for (let i = 0; i < value.length; i++) {
            observer(value[i]);
        }
    }
    walk (data) {
        //获取对象的属性
        let keys = Object.keys(data);
        keys.forEach((key) => {
            // console.log(key, data[key])
            defineReactive(data, key, data[key]);
        });
    }
}

function defineReactive (data, key, value) {
    // console.log(data);
    let childDep = observer(value);
    //每个属性都有一个dep
    let dep = new Dep();
    console.log('----------', value, dep);
    Object.defineProperty(data, key, {
        //当页面取值时候说明页面用来渲染啦。
        get () {
            if (Dep.target) {
                //依赖收集
                dep.depend();
                if (childDep) {
                    childDep.dep.depend();
                }

            }
            // console.log('用户获取值啦');
            return value;
        },
        set (newValue) {
            console.log('用户设置值啦');
            if (newValue == value) return;
            observer(newValue);
            value = newValue;
            //依赖更新
            dep.notify();
        }
    });
}
export function observer (value) {
    // console.log(data);
    //是对象并且不是null才观测
    if (typeof value !== 'object' || value === null) {
        return;
    }
    if (value.__ob__ && value.__ob__ instanceof Observer) {
        return value.__ob__;
    }
    return new Observer(value);
}