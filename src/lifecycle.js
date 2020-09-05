import {
    patch
} from "./vdom/patch";
import Watcher from "./observer/watcher";

export function lifecycleMinxin(Vue) {
    //将虚拟节点渲染成真实节点到页面上
    Vue.prototype._update = function (vnode) {
        // console.log(vnode);
        const vm = this;
        vm.$el = patch(vm.$el, vnode);
    }
}

export function mountComponent(vm, el) {
    //调用render方法渲染el属性
    //先调用render方法创建虚拟节点，再将虚拟节点渲染成真实节点到页面上
    //页面挂载之前调用beforeMount
    callHook(vm, 'beforeMount');

    let updateComponent = () => {
        vm._update(vm._render());
    };

    new Watcher(vm, updateComponent, () => {}, true);

    //要把属性和watcher绑定在一起

    //页面挂载之后调用mounted
    callHook(vm, 'mounted');
}

export function callHook(vm, hook) {
    let handlers = vm.$options[hook];
    // console.log(handlers)
    handlers = handlers || [];
    let len = handlers.length;
    if (len > 0) {
        for (let i = 0; i < len; i++) {
            //更改生命周期里的this指向
            handlers[i] && handlers[i].call(vm);
        }
    }
}