import {
    initMixin
} from './init.js';
import { lifecycleMinxin } from './lifecycle.js';
import { renderMinxin } from './vdom/index.js';

function Vue (options) {
    // 入口方法,做初始化操作
    this._init(options);
}

// 写成一个个的插件进行对原型的扩展
initMixin(Vue);

//混合生命周期 渲染
lifecycleMinxin(Vue);

//混入渲染相关
renderMinxin(Vue);


export default Vue;