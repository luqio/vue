var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var webpack = require('webpack');
 
var extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css"
});

//引入基本配置
var config = require('./webpack.config');

var rulesscss = {
        test: /\.scss$/,
        use: extractSass.extract({
            use: [{
                loader: "css-loader"
            }, {
                loader: "sass-loader"
            }]
        })
    };

config.module.rules.push(rulesscss);

config.plugins = [
    //提取css为单文件
    extractSass,

    new HtmlWebpackPlugin({
        filename: '../index.html',
        template: path.resolve(__dirname, '../src/index.html'),
        inject: true
    }),

    new webpack.LoaderOptionsPlugin({
        options: {
            vue: {
                loaders: {
                    css: ExtractTextPlugin.extract("css-loader")
                }
            }
        }
    }),

    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendors',
        filename: 'vendors.js'
    }),

    new webpack.ProvidePlugin({
        $:"jquery",
        jQuery:"jquery",
        "window.jQuery":"jquery"
    })  

];

module.exports = config;