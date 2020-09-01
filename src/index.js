import {
    initMixin
} from './init.js';

function Vue (options) {
    // 入口方法,做初始化操作
    this._init(options);
}

// 写成一个个的插件进行对原型的扩展
initMixin(Vue);


export default Vue;