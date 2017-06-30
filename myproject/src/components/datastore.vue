<script>
    export default{
        state: {
            cropimgurl: '',
            afterCropimgurl: '',
            status: -2,//上传失败 -1;//上传成功未裁剪;  0;//上传并且裁剪成功
        },
        mutations: {
            changeImg (state, cropimgurl){
                state.cropimgurl = cropimgurl;
            },
            changeImgCrop (state, afterCropimgurl){
                console.log(afterCropimgurl);
                state.afterCropimgurl = afterCropimgurl;
            }
        },
        getters: {
            status (state) {
                var cropimgurl = state.cropimgurl;
                var afterCropimgurl = state.afterCropimgurl;
                if(cropimgurl !== '' && afterCropimgurl !== ""){
                    return 0;
                }else if(cropimgurl !== '' && afterCropimgurl === ''){
                    return -1;
                }else if(cropimgurl === '' && afterCropimgurl === ''){
                    return -2;
                }
            }
        }
    }
</script>