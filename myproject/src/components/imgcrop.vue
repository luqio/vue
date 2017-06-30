<template>
    <div class="imgcrop--content">
        <div class="dialogue-window__content">
            <div class="imgUpLoadPlugin__pop__reSelectBox">
                <a class="imgUpLoadPlugin__button--reSelect">
                    重新选择
                    <imguploadinput :upload="upload" @uploadimg= "uploadimgcallback"></imguploadinput>
                </a>
                <span class="imgUpLoadPlugin__pop__tipbox">{{ imgcrop.poptip }}</span>
            </div>
            <div v-if="imgcrop.needCrop">
                <div class="imgUpLoadPlugin__cropBox" ref="cropBox" style="display:block">
                    <div v-show="loaded">
                        <div class="imgUpLoadPlugin__cropBox--targetBox imgUpLoadPlugin__cropBox--targetBox-holder" ref="targetBox">
                            <span class="imgUpLoadPlugin__cropBox--targetBox__mox"></span>
                            <img :src="cropimgurl"  style="height:auto;" alt="" ref="targetBox__img">
                        </div>
                        <div class="imgUpLoadPlugin__cropBox--preview__pane" ref="preview__pane">
                            <div class="imgUpLoadPlugin__cropBox--preview__container" ref="preview__container" style="width:234px">
                                <img :src="cropimgurl"  ref="preview__img">
                            </div>
                        </div>
                    </div>
                    <img v-show="!loaded" :src="imgcrop.imgload"  alt="" class="imgUpLoadPlugin--loadingImg" ref="initpop__loadingImg"/>
                </div>
            </div>
            <div v-if="!imgcrop.needCrop">
                <div class="imgUpLoadPlugin__cropBox--targetBox notNeedCrop" style="padding:15px 0px 0px 0px">
                    <img :src="cropimgurl"  style="height:auto;" alt="" ref="targetBox__img">
                    <img v-show="!loaded" :src="imgcrop.imgload"  alt="" class="imgUpLoadPlugin--loadingImg" ref="initpop__loadingImg"/>
                </div>
            </div>
        </div>
        <div class="dialogue-window__footer">
            <button class="button--major" :class="{disabled: disabled, submitting: submitting}" @click="bindsure" ref="buttonsave">确 认</button>
            <button class="button" ref="button--cancel"  @click="cancelcrop">取 消</button>
        </div>
    </div>
</template>

<script>
    import utilcom from './utilcom'
    import jcrop from '../common/jquery.jcrop'
    import imguploadinput from './imguploadinput'
    import { mapState } from 'vuex'

    export default{
        props: ['upload', 'imgcrop'],
        data (){
            return {
                loaded: false,
                disabled: true,
                submitting: false,
                jcrop_api: ''
            };
        },
        computed: mapState([
            'afterCropimgurl',
            'cropimgurl'
        ]),
        components: {
           imguploadinput 
        },
        methods: {
            //init裁剪插件
            initCrop (){
                var that = this;
                if(that.jcrop_api && typeof that.jcrop_api.destroy === 'function'){  
                    that.jcrop_api.destroy();
                }

                var jcrop_api,
                   boundx,
                   boundy,
                   $preview = $(this.$refs.preview__pane),
                   $pcnt = $(this.$refs.preview__container),
                   $pimg = $(this.$refs.preview__img),
                   xsize = $pcnt.width(),
                   ysize = $pcnt.height();
                function updatePreview(c){
                    if(that.imgcrop.minSize[0]>boundx || that.imgcrop.minSize[1]>boundy){
                        utilcom.showError('error', '图片过小');
                        that.disabled = true;
                        that.jcrop_api.release();      
                    }
                    if (parseInt(c.w) > 0) {
                        var rx = xsize / c.w;
                        var ry = ysize / c.h;
                          
                        $pimg.css({
                            width: Math.round(rx * boundx) + 'px',
                            height: Math.round(ry * boundy) + 'px',
                            marginLeft: '-' + Math.round(rx * c.x) + 'px',
                            marginTop: '-' + Math.round(ry * c.y) + 'px'
                        });
                    }
                }
                $(this.$refs.targetBox__img).Jcrop({
                    aspectRatio: xsize / ysize,
                    keySupport: false,
                    maxSize:that.imgcrop.maxSize,
                    minSize:that.imgcrop.minSize,
                    minSelect:that.imgcrop.minSelect,
                    touchSupport:true,       
                    bgFade: true,
                    allowSelect: that.imgcrop.allowSelect,
                    allowResize: that.imgcrop.allowResize,
                    boxWidth:384,
                    boxHeight:384,
                    bgOpacity:0.3,
                    bgColor:"#939393",
                    onChange: updatePreview,
                    onSelect: updatePreview
                },function(){
                        // Use the API to get the real image size
                    var bounds = this.getBounds();
                    boundx = bounds[0];
                    boundy = bounds[1];
                    // Store the API in the jcrop_api variable
                    that.jcrop_api = this;
                    //  updatePreview(that.jcrop_api.tellSelect());
                    this.setOptions({
                        setSelect:that.imgcrop.setSelect
                    });
                    var jW = that.jcrop_api.ui.holder.width();
                    var jH = that.jcrop_api.ui.holder.height();
                    var jtop = (384-jH)/2+1;
                    var jleft = (384-jW)/2+1;
                    that.jcrop_api.ui.holder.css({"top":jtop+"px","left":jleft+"px","float":"left","position":"relative"});
                    $preview.css({"top":-jtop+"px","left":(445-jleft)+"px"});
                     
                    // Move the preview into the jcrop container for css positioning
                    $preview.appendTo(that.jcrop_api.ui.holder);
                });
            },
            bindsure (){
                if(this.imgcrop.needCrop){
                    this.docrop();
                }else{
                    this.$emit('cropthen');
                }
            },
            docrop (event){
                var that = this, params = {};
                if(that.disabled === true || that.submitting === true){
                    return;
                }
                that.submitting = true;
                if(typeof that.jcrop_api!=="undefined" ){
                    if(that.jcrop_api.tellScaled().w===0){                                                                                              
                        that.submitting = false;
                        utilcom.showError('error', '请选择裁剪区域');
                        return;
                    }
                    params = {
                        "cropimgurl": that.cropimgurl, 
                        "x": that.jcrop_api.tellSelect().x/that.jcrop_api.getScaleFactor()[0],
                        "y": that.jcrop_api.tellSelect().y/that.jcrop_api.getScaleFactor()[1],
                        "_w": that.jcrop_api.getBounds()[0]/that.jcrop_api.getScaleFactor()[0],
                        "_h": that.jcrop_api.getBounds()[1]/that.jcrop_api.getScaleFactor()[1],
                        "h": that.jcrop_api.tellScaled().w,
                        "w": that.jcrop_api.tellScaled().h
                    };
                }
                
                utilcom.forajax({
                    url: that.imgcrop.service,
                    dataType: that.imgcrop.dataType
                },params, function(data){
                    if(Number(data.code) === 1){
                        var _resize = that.imgcrop.resize._w,
                        _resizeurl = that.imgcrop.resize.service,
                        _dataType = that.imgcrop.resize.dataType;
                        if(_resize && _resizeurl && Number(_resize) !== 0){
                            var _params = {
                                cropimgurl: data.url,
                                resize: _resize
                            };
                            that.resizeFN(_resizeurl, _dataType, _params);
                        }else{
                            that.successCB(data.url);
                        }
                    }else{
                        that.submitting = false;
                        utilcom.getnoticeText(Number(data.code), Number(data.rescode), that.imgcrop.loginurl);
                    }
                });
            },
            resizeFN (_resizeurl, _dataType, params){
                var that = this;
                utilcom.forajax({
                    url: _resizeurl,
                    dataType: _dataType
                },params, function(data){
                    if(Number(data.code) === 1){
                        that.successCB(data.url);
                    }else{
                        that.submitting = false;
                        utilcom.getnoticeText(Number(data.code), Number(data.rescode), that.imgcrop.loginurl);
                    }
                });
            },
            successCB (url){
                var that = this;
                that.submitting = false;
                store.commit('changeImgCrop', url);
                that.$emit('cropthen');
            },
            cancelcrop (){
                this.$emit("cropthen",'', '');
            },
            imgboxhtml (){
                var that = this;
                utilcom.preLoadImages(this.cropimgurl, function(){
                    that.loaded = true;
                    that.disabled = false;
                    if(that.imgcrop.needCrop){
                        that.initCrop();
                    }
                });
            },
            fEval (str){
                var fn = Function;
                return new fn("return "+str)();
            },
            uploadimgcallback (data){
                if(Number(data.code) === 1){
                    store.commit('changeImg', data.url);
                    store.commit('changeImgCrop', '');
                    this.loaded = false;
                    this.imgboxhtml();
                }
            },
            
            
        },
        // beforeCreate: function () {
        //     console.log('beforeCreate 钩子执行...');
        // },
        // cteated: function () {
        //     console.log('cteated 钩子执行...');
        // },
        // beforeMount: function () {
        //     console.log('beforeMount 钩子执行...');
        // },
        // mounted: function () {
        //     console.log('mounted 钩子执行...');
        // },
        // beforeUpdate: function () {
        //     console.log('beforeUpdate 钩子执行...');
        // },
        // updated: function () {
        //     console.log('updated 钩子执行...');
        // },
        // beforeDestroy: function () {
        //     console.log('beforeDestroy 钩子执行...');
        // },
        // destroyed: function () {
        //     console.log('destroyed 钩子执行...');
        // },
        mounted (){
            //console.log('mounted 钩子执行...');
            var _this = this;
            this.$nextTick(function(){
                var $pcon = $(_this.$refs.preview__container);
                var pcntWidth = parseInt($pcon.css("width"));
                var ratio = _this.imgcrop.aspectRatio;
                if(_this.fEval(ratio)>0){
                    $pcon.height((pcntWidth/_this.fEval(ratio))+"px");
                }
                _this.imgboxhtml();
                console.log(_this.cropimgurl);
            });
        }
    }
</script>
<style>
</style>