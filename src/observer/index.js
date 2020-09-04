import {
    arrayMethods
} from "./array";
import { defineProperty } from "../utils/index.js";

class Observer {
    constructor(value) {
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
            value.__proto__ = arrayMethods;
            this.observeArray(value);

        } else {
            //否则直接观测
            this.walk(value);
        }
    }
    observeArray (value) {
        for (let i = 0; i < value.length; i++) {
            observe(value[i]);
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
    Object.defineProperty(data, key, {
        get () {
            // console.log('用户获取值啦');
            return value;
        },
        set (newValue) {
            // console.log('用户设置值啦');
            if (newValue == value) return;
            observer(newValue);
            value = newValue;
        }
    });
}
export function observer (data) {
    // console.log(data);
    //是对象并且不是null才观测
    if (typeof data !== 'object' || data === null) {
        return data;
    }
    return new Observer(data);
}