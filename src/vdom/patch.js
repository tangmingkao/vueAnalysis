// vue 的渲染流程 =》 先初始化数据 =》 将模板进行编译 =》 
// render函数 =》 生成虚拟节点 =》 生成真实的dom  =》 扔到页面上

//将虚拟节点转换成真实节点，替换老节点
export function patch (oldVnode, vnode) {
    console.log(vnode);
    //将虚拟节点转化成真实节点
    let el = createElm(vnode); //产生真实dom
    //获取老的app的父节点 => body
    let parentElm = oldVnode.parentNode;
    // console.log(parentElm, oldVnode);
    //当前的真实元素插入到app的后面
    parentElm.insertBefore(el, oldVnode.nextSibling);
    //删除老的节点
    parentElm.removeChild(oldVnode);
}

function createElm (vnode) {
    let { tag, children, key, data, text } = vnode;
    if (typeof tag == 'string') {
        //创建元素 放到vnode.el上
        vnode.el = document.createElement(tag);
        //处理属性相关
        updateProperties(vnode);
        //遍历儿子 将儿子渲染后的结果放到父节点中
        children.forEach(child => {
            vnode.el.appendChild(createElm(child));
        });
    } else {
        //创建文本节点放到vnode.el上
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}

function updateProperties (vnode) {
    let el = vnode.el;
    let newProps = vnode.data || {};
    for (let key in newProps) {
        if (key == 'style') {
            //样式需要单独处理
            for (let styleName in newProps['style']) {
                el['style'][styleName] = newProps['style'][styleName];
            }
        } else if (key == 'class') {
            el.className = el['class'];
        } else {
            el.setAttribute(key, newProps[key]);
        }
    }

}