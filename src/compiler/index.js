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
    console.log(code);

}