export function renderMinxin(Vue) {
    //创建虚拟元素节点
    Vue.prototype._c = function () {
        return createElement(...arguments);
    }
    //创建虚拟文本节点
    Vue.prototype._v = function (text) {
        return createTextVnode(text);
    }
    //stringify
    Vue.prototype._s = function (val) {
        return val == null ? '' : (typeof val == 'object' ? JSON.stringify(val) : val);
    }

    Vue.prototype._render = function () {
        const vm = this;
        const render = vm.$options.render;
        let vnode = render.call(vm);
        // console.log(vnode);
        return vnode;
    }
}

function createElement(tag, data = {}, ...children) {
    let key = data.key;
    if (key) {
        delete data.key;
    }
    return vnode(tag, data, data.key, children);
}

function createTextVnode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
}

//用来产生虚拟dom
function vnode(tag, data, key, children, text) {
    return {
        tag,
        data,
        key,
        children,
        text
    }
}