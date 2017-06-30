//引入必要的模块
var express = require('express');
var router = express.Router();
var webpack = require('webpack');
var config = require('./webpack.dev.config');
var path = require('path');


//创建express实例
var app = express();

//调用webpack并把配置传递过去
var compiler = webpack(config);

//使用webpack-dev-middleware 中间件
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    stats: {
        colors: true,
        chunks: false
    }
})

//使用webpack-hot-middleware 中间件
var hotMiddleware = require('webpack-hot-middleware')(compiler)

//webpack监听html文件改变事件  
// 设置回调来访问编译对象：
compiler.plugin('compilation', function(compilation){
    // 现在设置回调来访问编译中的步骤：
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        // 发布事件
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})

//注册中间件
app.use(devMiddleware);
//注册中间件
app.use(hotMiddleware);

// app.all('/src3', function(req, res){
//     res.send(req.hostname);
//     console.log(444);
// })

// app.all('/index.htm', function (req, res) {
//    res.sendFile(path.resolve('test.html'));
// })

// app.use(function (req, res, next) {
//   console.log('Time:', Date.now());
//   res.render(path.resolve('test.html'));
// });

//app.use(express.static('public'));

//监听 8888端口，开启服务器
app.listen(4002, function (err) {
    if(err){
        console.log(err);
        return
    }
    console.log('listening at http://localhost:4002')
    // body...
})


//webpack-dev-middleware是一个处理静态资源的中间件，
//webpack-hot-middleware是一个结合webpack-dev-middleware使用的middleware，它可以实现浏览器的无刷新更新（hot reload）。