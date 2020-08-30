import {
    initState
} from "./state";

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        // console.log(options);
        const vm = this;
        vm.$options = options;

        //vue里面核心特效 响应式数据原理

        //初始化状态，将数据进行初始化劫持
        initState(vm);

    }
}