export default function (data){
    var noticecomponent = {
        template: '<div class="notice show" ref="notice">\
            {{  text }}\
        </div>',
        props: {
            text: String,
            duration: {
                default: 3000
            }, 
            's': [String, Number, Object]
        },
        methods: {
            hide (){
                var that = this;
                setTimeout(function(){
                    that.$emit("hide");
                }, that.getLongestTransitionTime()*1000);
            },
            getpos (){
                var left = ($(window).width() - $(this.$refs.notice).outerWidth())/2;
                $(this.$refs.notice).css('left', left);
            },
            getLongestTransitionTime (){
                var dom = jQuery(this.$refs.notice);
                var testDiv = document.createElement("div");
                testDiv.innerHTML = "<!--[if lt IE 9]><i></i><![endif]-->";
                var lteIE9 = (testDiv.getElementsByTagName("i").length === 1);
                if (lteIE9) {
                    return 0;
                }

                var durationString = dom.css('transitionDuration');
                if(!durationString || !durationString.length || durationString.length<=0 || durationString===''){
                    return 0;
                }
                var durations = durationString.split(',');
                for(var i = 0; i<durations.length; i++){
                    durations[i] = durations[i].replace('', '').replace('s', '');
                    if(durations[i]===''){
                    durations[i]=0;
                    }else{
                        durations[i] = parseFloat(durations[i]);
                    }
                }
                if(durations.length<=0){
                    return 0;
                }
                return Math.max.apply(Math, durations);
            }
        },
        mounted (){//使用mounted钩子函数不能保证钩子函数中的this.$el在document中，为此还得引入Vue.nextTick/vm.$nextTick
            var that = this;
            this.$nextTick(function(){
                that.getpos();
                if(this.duration){
                  setTimeout(function(){
                    that.hide();
                  }, that.duration);
                }
            });
        }
    }
    if($('#notice_outter').length === 0){
        $("body").append('<div id="notice_outter"></div>');
    }
   return new Vue({
        el: '#notice_outter',
        template: '<noticecomponent v-if="notice.show" :text="notice.text" :class="notice.s" @hide="notice.show=false"></noticecomponent>',
        components: {
            noticecomponent
        },
        data: {
            notice: data
        }
    });
}