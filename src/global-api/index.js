import {
    mergeOptions
} from "../utils/index.js";

export function initGlobalApi(Vue) {
    Vue.options = {}; //存如例如： Vue.components Vue.directive
    // console.log(Vue);
    Vue.mixin = function (mixin) {
        // console.log(mixin);
        //合并对象 (先考虑生命周期，不考虑其他合并 data computed watch 等)
        this.options = mergeOptions(this.options, mixin);
        // console.log(this.options, mixin)
    }
}