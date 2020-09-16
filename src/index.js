import {
    initMixin
} from './init.js';
import {
    lifecycleMinxin
} from './lifecycle.js';
import {
    renderMinxin
} from './vdom/index.js';
import {
    initGlobalApi
} from './global-api/index.js';
import {
    stateMixin
} from './state.js';

//用Vue的构造函数 创建组件
function Vue(options) {
    // 入口方法,做初始化操作
    this._init(options);
}

//原型方法
// 写成一个个的插件进行对原型的扩展
initMixin(Vue);
//混合生命周期 渲染
lifecycleMinxin(Vue);
//混入渲染相关
renderMinxin(Vue);

stateMixin(Vue);

//静态方法 Vue.component Vue.directive Vue.extend Vue.mixin ....
initGlobalApi(Vue);
//初始化方法


export default Vue;