import c_imgupload from './imgupload'
import Vue from 'vue'
import Vuex from 'vuex'
import datastore from './datastore'

Vue.use(Vuex);
window.store = new Vuex.Store(datastore);

export default function(opts){
    this.config = {
        container: "body",
        imgupload: {
            service: '',
            sizeLimit: 2048,//图片大小限制：2048k
            imgtype: "jpg/jpeg/gif/png/"
        },
        imgcrop: {
            needCrop: true, //是否需要裁剪
            aspectRatio: 16/9, //裁剪比例
            setSelect: [0,0,1600,900], //初始化裁剪框的位置和大小
            allowSelect: true, //是否允许新选框
            allowResize: true, //是否允许选框缩放
            maxSize: [0,0], //裁剪框的最大宽高
            minSize: [0,0], //裁剪框的最小宽高
            minSelect: [0,0], //选框最小选择尺寸。说明：若选框小于该尺寸，则自动取消选择
            previewWidth: 239,//裁剪预览区域的宽度，高度会根据传的aspectRatio 自动变请。最大239,
            minWH: [0,0],
            poptip: '支持JPG、PNG，大小不超过2M', 
            imgload: '/lib/img/icon/loading-white-tudou.gif',
            service: "",
            dataType: "json",
            resize:{
                _w: 20,
                service: '',
                dataType: ""
            }
        },
        loginurl: 'https://user.tudou.com/login?callback='+ encodeURIComponent(window.location.href),
        showmarsk: function() {
        },
        hidemarsk: function(status, cropimgurl, afterCropimgurl){
        }
    };
    
    //this.config = arguments[0] ? (typeof(arguments[0])==='object' ? utilcom._mergeConfig(this.config, opts, true) : opts) : this.config;

    this.config = opts && $.type(opts) === 'object' && !$.isEmptyObject(opts) ? $.extend(true, {}, this.config, opts) : this.config;
    this.config.imgupload.loginurl = this.config.loginurl;
    this.config.imgupload.sizeLimit = this.config.imgupload.sizeLimit*1024;
    this.config.imgcrop.loginurl = this.config.loginurl;

    this.config.container.append('<div class="imgupload-component" style="position:absolute;width:100%;top:0px; left:0px;height:100%;z-index:9"></div>');

    var cImgupload = new Vue({
        store,
        el: this.config.container.find('.imgupload-component')[0],
        template: "<c_imgupload :upload='upload' :imgcrop='imgcrop' slot='ButtonText' @showmarsk = 'showmarsk' @hidemarsk = 'hidemarsk'></c_imgupload>",
        components: { 
            c_imgupload
        },
        data:{
            upload: this.config.imgupload,
            imgcrop: this.config.imgcrop
        },
        methods: {
            showmarsk: this.config.showmarsk,
            hidemarsk: this.config.hidemarsk
        }
    });
    return cImgupload;
}