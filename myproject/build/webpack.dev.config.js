var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

//引入基本配置
var config = require("./webpack.config");

config.output.publicPath = '/';

var rulesscss = {
        test: /\.scss$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings  将css插入到页面的style标签
        }, {
            loader: "css-loader" // translates CSS into CommonJS  是处理css文件中的url()等
        }, {
            loader: "sass-loader" // compiles Sass to CSS 
        }]
    };

config.module.rules.push(rulesscss);

config.plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
      // 模块热替换插件
    new webpack.HotModuleReplacementPlugin(),
        // 允许错误不打断程序
    new webpack.NoEmitOnErrorsPlugin(),
     // 提取入口文件里面的公共模块
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendors', filename: 'vendors.js'}),
    // 生成html文件的名字，路径和生产环境下的不同，要与修改后的publickPath相结合，否则开启服务器后页面空白
    new HtmlWebpackPlugin({
        filename: 'src/index.html',
        template: path.resolve(__dirname, '../src/index.html'),
        inject: true,
        // 需要引入entry里面的哪几个入口
        chunks: ['vendors','index'],
        inject: true,
        title: "test",
        minify:{
            removeComments:true,
            collapseWhitespace:true
        }
    }),
    new webpack.ProvidePlugin({
        $:"jquery",
        jQuery:"jquery",
        "window.jQuery":"jquery"
    })  
]
// 动态向入口配置中注入 webpack-hot-middleware/client
var devClient = './build/dev-client';
console.log(devClient);
Object.keys(config.entry).forEach(function (name, i) {
    var extras = [devClient]
    config.entry[name] = extras.concat(config.entry[name])
})

module.exports = config;
