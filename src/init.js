import {
    initState
} from "./state";
import {
    compileToFunction
} from "./compiler/index.js";
import {
    mountComponent,
    callHook
} from "./lifecycle";
import {
    mergeOptions
} from "./utils/index.js";

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        // console.log(options);
        const vm = this;
        //将用户自定义的options和全局的options进行合并
        vm.$options = mergeOptions(vm.constructor.options, options);
        // console.log(vm.$options);
        //vue里面核心特效 响应式数据原理
        //初始化状态之前调用生命周期的beforeCreate函数
        callHook(vm, 'beforeCreate');
        //初始化状态，将数据进行初始化劫持
        initState(vm);
        //初始化状态之后调用created
        callHook(vm, 'created');
        //页面挂载之前调用beforeMount
        callHook(vm, 'beforeMount');
        //页面挂载
        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }
        //页面挂载之后调用mounted
        callHook(vm, 'mounted');

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
            // console.log(template);
            //编译原理： 将模版编译成render函数
            const render = compileToFunction(template);
            options.render = render;
        }

        // 渲染时用的都是这个render方法

        // 需要挂载这个组件
        mountComponent(vm, el);

    }
}