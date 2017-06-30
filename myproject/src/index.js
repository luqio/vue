import './css/imgupload.scss'
import Vue from 'vue'
import Favlist from './components/Favlist'
import cUpload from './components/imgupload_excute.js'
import jqueryui from 'jquery-ui'

window.Vue = Vue;

$( "#draggable" ).draggable();

new Vue({
    el: '#app',
    components: { Favlist }
});

new cUpload({
    container: $("#imgupload"),
    imgupload:{
        imgtype:'jpg/png/',
        service: "/user/imgupload?callback=window.imgUploadCallBack"
    },
    imgcrop: {
        aspectRatio:46/69,
        minSize:[460,690],
        service: "/user/imgcrop?callback=window.imgUploadCallBack"
    },
    showmarsk: function(){
        console.log(5522)
        //console.log("start mask");
    },
    hidemarsk: function(upCropstatus,cropimgurl,afterCropimgurl){
        console.log(55)
        if(afterCropimgurl){
            
            //$uploadImg.css('background-image','url('+afterCropimgurl+')');
            //$imgFace[0].src = afterCropimgurl;
            //$imgReset.addClass('contain__tips-link');
            //PAGEDATE.pic = true;
        }/*else{
            new StateBar({
                type: 'danger',
                msg: '截图失败，请重新截图！',
                classname: 'bodan__yk-statebar',
                callback: function(){}
            }).show();
        }*/
    }
});