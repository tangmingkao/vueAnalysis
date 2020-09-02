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

const ELEMENT_TYPE = 1;
const TEXT_TYPE = 3;

export function parseHTML (html) {
    let root;
    let currentParent;
    let stack = [];
    function createASTElement (tagName, attrs) {
        return {
            tag: tagName, //标签名
            type: ELEMENT_TYPE, //元素节点
            children: [], //孩子列表
            attrs: attrs, //属性集合
            parent: null, //父元素
        }
    }
    function start (tagName, attrs) {
        // 创建一个元素 作为根元素
        let element = createASTElement(tagName, attrs);
        if (!root) {
            root = element;
        }
        //当前解析的标签，保存起来
        currentParent = element;
        //将产生的ast元素放到栈中
        stack.push(element);
    }

    function end (tagName) {
        // 在结尾标签处 创建父子关系
        //取出栈中的最后一个数据
        let element = stack.pop();
        //栈中上一个就是该元素的父元素
        currentParent = stack[stack.length - 1];
        //在闭合标签时候可以知道这个标签的父亲是谁.
        if (currentParent) {
            element.parent = currentParent;
            //同理: 父元素的子元素就包含该元素
            currentParent.children.push(element);
        }
    }
    function chars (text) {
        text = text.trim();
        if (text) {
            currentParent.children.push({
                type: TEXT_TYPE,
                text: text,
            });
        }

    }
    // console.log(html);
    //只要html不为空就一直解析
    while (html) {
        let textEnd = html.indexOf('<');
        if (textEnd == 0) {
            // parseStartTag();
            // 开始标签匹配的结果 处理开始
            const startTagMatch = parseStartTag();
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs);
                continue;
            }
            const endTagMatch = html.match(endTag);
            //处理结束标签
            if (endTagMatch) {
                advance(endTagMatch[0].length);
                // 将结束标签传入 
                end(endTagMatch[1]);
                continue;
            }
        }
        let text;
        //处理文本
        if (textEnd >= 0) {
            text = html.substring(0, textEnd);
        }
        if (text) {
            advance(text.length);
            chars(text);
        }
    }

    function advance (n) {
        //将字符串进行截取操作 再更新html内容
        html = html.substring(n);
    }

    function parseStartTag () {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [],
            };
            //删除开始标签
            advance(start[0].length);
            //如果直接是闭合标签，说明没有属性
            let end, attr;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5],
                });
                // 去掉当前属性
                advance(attr[0].length);
                // console.log(end, attr);
                // >  删除匹配到的结束标签
            }
            if (end) {
                advance(end[0].length);
                return match;
            }
        }
    }

    return root;
}
