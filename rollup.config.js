import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
    input: './src/index.js', //入口文件
    output: {
        format: 'umd', //模块化类型 esModule commonjs
        name: 'Vue',
        file: 'dist/umd/vue.js',
        sourcemap: true,
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        serve({
            open: false,
            //浏览器端口
            port: 3000,
            contentBase: '',
            openPage: '/index.html'
        }),
    ],
}