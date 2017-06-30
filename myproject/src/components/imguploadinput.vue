<template>
    <form class="imgUpLoadPlugin__form" ref="imgUpLoadPlugin__form" method="post" :action="upload.service" enctype="multipart/form-data" target="imgUpLoadPlugin__iframe_a">
        <input type="file" name="upfile" ref="imgUpLoadPlugin__input" class="imgUpLoadPlugin__form--input" :class="formstyle" accept="image/jpg, image/png, image/gif, image/jpeg" v-on:change.active="afterchange($event.target.value)"/>
        <input type="hidden" name="size" class="size"  :value="upload.sizeLimit"/>
    </form>
</template>

<script>
    import utilcom from './utilcom'
    export default{
        props: ['upload'],
        data (){
            return{
                formstyle: {
                    forie: (navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0),
                    forChrom: window.navigator.userAgent.indexOf("Chrome") !== -1
                }
            };
        },
        methods: {
            afterchange (value){
                var that = this;
                var _this = $(this.$refs.imgUpLoadPlugin__input);
                if(_this.val() === ""){
                    utilcom.showError('error', '请选择要上传的图片');
                    return;
                }
                window.imgUploadCallBack = function(data){
                    data={};
                    data.code = 1;
                    if(Number(data.code) === 1){
                        data.url = 'http://r2.ykimg.com/054204085688F9A06A0A4B0460DC1C0B';
                        that.$emit("uploadimg", data);
                    }else{
                        utilcom.getnoticeText(Number(data.code), Number(data.rescode), that.upload.loginurl);
                    }
                };

                var AllImgExt = that.upload.imgtype;
                var extName = _this.val().substring(_this.val().lastIndexOf(".")+1).toLowerCase();//（把路径中的所有字母全部转换为小写）          
                if(AllImgExt.indexOf(extName+"/") === -1)          
                {  
                    utilcom.showError('error', "该文件类型不允许上传。请上传 " + AllImgExt.substring(0,AllImgExt.length-1));
                    return false;
                }

                var filesize;
                if (_this[0].files && _this[0].files[0]) {
                    filesize = _this[0].files[0].size;
                    if(filesize > that.upload.sizeLimit){
                        utilcom.showError('error', '文件过大');
                        return false;
                    }  
                }

                window.setTimeout(function(){
                    window.imgUploadCallBack();
                },300)
                // this.$refs.imgUpLoadPlugin__form.submit();
                _this.val("");
            }
        }
    }
</script>
<style>
</style>