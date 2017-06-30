var hotclient = require('webpack-hot-middleware/client')

//订阅事件，当event.action === 'reload'时执行页面刷新
hotclient.subscribe(function (event) {
    if(event.action === 'reload'){
        window.location.reload();
    }
    // body...
})