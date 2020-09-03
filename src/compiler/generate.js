// 编写<div id="app" style="color:red"> hello {{name}} <span>hello</span></div>
// 预期结果:render(){
//    return _c('div',{id:'app',style:{color:'red'}},_v('hello'+_s(name)),_c('span',null,_v('hello')))
//}
// _c('div',{id:"app",style:{"color":"red"}},_v("hello "+_s(name)),_c('span',undefined,_v("hello")))
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

function genProps (attrs) {
    let str = '';
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        if (attr.name === 'style') {
            //对样式进行特殊处理
            let obj = {};
            let tempArr = attr.value.split(';');
            tempArr.forEach((item) => {
                let [key, value] = item.split(':');
                obj[key] = value;
            });
            attr.value = obj;
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`;
    }
    return `{${str.slice(0, -1)}}`;
}
function gen (node) {
    if (node.type == 1) {
        //生成元素子节点
        return generate(node);
    } else {
        //如果是文本节点
        let text = node.text; //获取文本
        //判断是否是普通的文本(不带{{name}})
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`
        }
        //存放一段代码
        let tokens = [];
        // 如果正则是全局模式 需要每次使用前置为0
        let lastIndex = defaultTagRE.lastIndex = 0;
        //每次匹配的结果
        let match, index;
        while ((match = defaultTagRE.exec(text)) != null) {
            //保存匹配到的结果
            index = match.index;
            if (index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, index)))
            }
            tokens.push(`_s(${match[1].trim()})`);
            lastIndex = index + match[0].length;
        }
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
        return `_v(${tokens.join('+')})`;

    }
}
function genChildren (el) {
    const children = el.children;
    if (children) {
        return children.map(child => gen(child)).join(',');
    }
}
export function generate (el) {
    // console.log(el);
    //生成儿子
    let children = genChildren(el);
    //生成code
    let code = `_c('${el.tag}',${el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'}${children ? `,${children}` : ''})`;
    return code;
}