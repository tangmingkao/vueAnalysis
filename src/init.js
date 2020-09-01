import {
    initState
} from "./state";

export function initMixin (Vue) {
    Vue.prototype._init = function (options) {
        // console.log(options);
        const vm = this;
        vm.$options = options;

        //vue里面核心特效 响应式数据原理

        //初始化状态，将数据进行初始化劫持
        initState(vm);

    }

    Vue.prototype.$mount = function (el) {
        //挂载操作
        const vm = this;
        const options = vm.$options;
        el = document.querySelector(el);
        vm.$el = el;

        //渲染操作 1) 默认先找render方法 => 2) 没有传入render方法会查找template => 3) 如果既没有render方法也没有template则找到当前el指定的元素中的内容进行渲染
        //ast解析template => render函数

        if (!options.render) {
            //如果没有render函数，将template转化成render函数
            let template = options.template;
            if (!template && el) {
                //如果没有template必须有el，否则就要提示错误了。
                template = el.outerHTML;

            } else {
                console.log('el or template not surpport');
            }
        }

    }
}