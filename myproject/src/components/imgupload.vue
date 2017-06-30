<template>
    <div>
        <span><slot name="ButtonText">上传图片</slot></span>
        <imguploadinput :upload="upload" @uploadimg= "uploadimgcallback"></imguploadinput>
        <iframe style="display:none" v-if="!hasiframe()" name="imgUpLoadPlugin__iframe_a"></iframe>
    </div>
</template>

<script>
    import imguploadinput from './imguploadinput'
    import cdialogue from './dialogue'
    import imguploadImgcrop from './imgcrop'
    import { mapState, mapGetters  } from 'vuex'
    export default{
        computed:{
            cropimgurl () {
                return this.$store.state.cropimgurl
            },
            afterCropimgurl (){
                return this.$store.state.afterCropimgurl
            },
            status () {
                return this.$store.getters.status
            }
        },
        components: { 
            imguploadinput
        },
        props: ["upload", "imgcrop"],
        methods: {
            hasiframe () {
                if(document.getElementsByName('imgUpLoadPlugin__iframe_a').length>0){
                    return true;
                }else{
                    return false;
                }
            },
            dohidecrop () {
                this.$emit('hidemarsk', this.status, this.cropimgurl, this.afterCropimgurl);
            },
            docrop () {
                console.log(this.status);
                var that = this, Popup;
                if(!Popup){
                    if($('#qwindow_outter').length === 0){
                        $("body").append('<div id="qwindow_outter"></div>');
                    }
                    Popup = new Vue({
                        template: '<cdialogue v-if="dialogue.showdialogue" :dialogue="dialogue" @dialogue-hide="dialoguehide" >\
                            <div slot="content">\
                            <imguploadImgcrop :upload="upload" :imgcrop="imgcrop" @cropthen="cropthen"></imguploadImgcrop>\
                            </div>\
                        </cdialogue>',
                        el: '#qwindow_outter',
                        store: window.store,
                        components: {
                            cdialogue,
                            imguploadImgcrop
                        },
                        data: {
                            dialogue: {
                                showdialogue: true,
                                title: '上传图片',
                                width: "775px",
                                height: "auto",
                                class: 'dialogue-window--simple__cutoff imgupload-window'
                            },
                            // crop: {
                            //     cropimgurl: that.cropimgurl,
                            // },
                            imgcrop: that.imgcrop,
                            upload: that.upload
                        },
                        methods:{
                            cropthen: function(){
                                this.dialogue.showdialogue = false;
                                that.dohidecrop();
                            },
                            dialoguehide: function(){
                                this.dialogue.showdialogue = false;
                                that.dohidecrop('', '');
                            },
                            dialogueshow: function(){
                                this.dialogue.showdialogue = true;
                            }
                        } 
                    });
                }else{
                    Popup.dialogueshow();
                    //Popup.crop.cropimgurl = that.cropimgurl;
                }
            },
            uploadimgcallback (data) {
                if(Number(data.code) === 1){
                    store.commit('changeImg', data.url);
                    store.commit('changeImgCrop', '');
                    console.log(this.$store.state.cropimgurl);
                    this.$emit('showmarsk');
                    this.docrop();
                }
            }
        }
    }
</script>
<style>
</style>