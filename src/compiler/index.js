//匹配的是标签名字
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
// ?: 匹配不捕获 
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// 标签开头的正则 捕获的内容是标签名
const startTagOpen = new RegExp(`^<${qnameCapture}`);
// 匹配标签结尾的 </div>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
// 匹配属性的
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// 匹配标签结束的 >
const startTagClose = /^\s*(\/?)>/;
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

function start(tagName, attrs) {

}

function end(tagName) {

}

function chars(text) {

}

function parseHTML(html) {
    //只要html不为空就一直解析
    while (html) {
        let textEnd = html.indexOf('<');
        if (textEnd == 0) {
            parseStartTag();
        }
        break;
    }

    function advance(n) {
        //将字符串进行截取操作 再更新html内容
        html = html.substring(n);
    }

    function parseStartTag() {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[0],
                attrs: [],
            };
            //删除开始标签
            advance(start[0].length);
            //如果直接是闭合标签，说明没有属性
            let end;
            let attr;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                console.log(end, attr);
                break;
            }
        }
    }
}

export function compileToFunction(template) {
    console.log(template);
    //html模版 => render函数
    // 虚拟dom 是用对象描述真实dom节点
    // ast语法树 描述语言本身
    // 1. 将html代码转化成ast语法树。用ast树描述语言本身
    let ast = parseHTML(template);
    // 2. 通过ast语法树重新生成代码


}