var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports={
    //入口文件，path.resolve()方法，可以结合我们给定的两个参数最后生成绝对路径，最终指向的就是我们的index.js文件
    entry: {
        index: path.resolve(__dirname, '../src/index.js'),
        vendors: ['Vue', 'vue-router', 'vuex']
    },
    output: {
        // 输出路径是 myproject/output/static
        path: path.resolve(__dirname, '../output/static'),
        publicPath: 'static/',
        // 基于文件的md5生成Hash名称的script来防止缓存
        filename: '[name].[hash].js',
        // 非主入口的文件名，即未被列在entry中，却又需要被打包出来的文件命名配置
        chunkFilename: '[id].[chunkhash].js'
    },
    module: {
        
        rules: [
            // 使用vue-loader 加载 .vue 结尾的文件
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },

            //加载图片
            {
                test: /\.(png|jpg|gif|svg|svg|woff|woff2|ttf|eot)$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'img/[name]dd[hash:7].[ext]'
                }
            }
        ]
    },
    resolve: {
         // require时省略的扩展名，遇到.vue结尾的也要去加载
        extensions: [".webpack.js", ".web.js", ".js", '.vue'],
        alias: {
          // 例如 import Vue from 'vue'，会自动到 'vue/dist/vue.common.js'中寻找
          'vue$': 'vue/dist/vue.esm.js',
          '@': resolve('src')
          // 模块别名地址，方便后续直接引用别名，无须写长长的地址，注意如果后续不能识别该别名，需要先设置root
        }
    },
    plugins: [
        // 自动生成html 插件，如果创建多个HtmlWebpackPlugin的实例，就会生成多个页面
        new HtmlWebpackPlugin({
            // 生成html文件的名字，路径和生产环境下的不同，要与修改后的publickPath相结合，否则开启服务器后页面空白
            filename: '../index.html',
            // 源文件，路径相对于本文件所在的位置
            template: path.resolve(__dirname,'../src/index.html'),
            // 需要引入entry里面的哪几个入口
            chunks: ['vendors','index'],
            inject: true,
            title: "test",//不好用  // 生成html文件的标题
            // hash如果为true，将添加hash到所有包含的脚本和css文件，对于解除cache很有用
        // minify用于压缩html文件，其中的removeComments:true用于移除html中的注释，collapseWhitespace:true用于删除空白符与换行符
            minify:{
                removeComments:true,
                collapseWhitespace:true
            }
        })
    ]
}