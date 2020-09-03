import { parseHTML } from "./parse.js";
import { generate } from "./generate.js";

export function compileToFunction (template) {
    // console.log(template);
    //html模版 => render函数
    // 虚拟dom 是用对象描述真实dom节点
    // ast语法树 描述语言本身
    // 1. 将html代码转化成ast语法树。用ast树描述语言本身
    let ast = parseHTML(template);
    // console.log(ast);

    // 2. 优化静态节点

    // 3. 通过ast语法树重新生成代码
    let code = generate(ast);
    // console.log(code);

    // 4.将字符串变成函数 限制取值范围 通过with来进行取值 稍后调用render函数就可以通过改变this 让这个函数内部取到结果了
    let renderCode = `with(this){return ${code}}`;
    let renderFn = new Function(renderCode);
    // console.log(renderFn);
    return renderFn;
}