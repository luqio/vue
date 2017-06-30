<template>
    <div>
        <div class="qwindow_mask  dialogue-window" ref="winmask"></div>
        <div class="qwindow" :class="dialogue.class" ref="win" :style="winstyle">
            <div class="winbox">
                <div class="winhead" >
                    <div class="wintitle" style="display:block">
                        <slot name="title">
                            {{ dialogue.title }}
                        </slot>
                    </div>
                    <div class="winclose" @click="hidefunc">&#xe606;</div>
                </div>
                <div class="winbody">
                    <slot name="content">
                        {{ dialogue.content }}
                    </slot>
                </div>
            </div>
            <div class="winbg"></div>
        </div>
    </div>
</template>

<script>
    export default{
        props:  ['dialogue'],
        computed: {
            winstyle (){
                return {
                    width: this.dialogue.width,
                    height: this.dialogue.height,
                    top: 'auto',
                    left: 'auto'
                };
            }
        },
        methods: {
            hidefunc (){
                this.$emit("dialogue-hide");
            },
            pos (){
                var offset ={ top: $(window).scrollTop(), left: $(window).scrollLeft()};
                var _w = jQuery(this.$refs.win).outerWidth(),
                    _h = jQuery(this.$refs.win).outerHeight();
                var top, left;
                top = offset.top + parseInt(($(window).height()-_h)/2);
                left = offset.left + parseInt(($(window).width()-_w)/2);

                this.winstyle.top = top+"px";
                this.winstyle.left = left+"px";
                jQuery(this.$refs.win).css({top:top+"px", left: left+"px"});
            },
            show (){
                var self = this;
                $(self.$refs.winmask).css('visibility', 'visible').show();
                $(self.$refs.win).show();
                setTimeout(function(){
                    $(self.$refs.win).addClass('show');
                    $(self.$refs.winmask).addClass('show');
                   // $(self.$refs.winmask).addClass(self.randomMaskClassName);
                },10);
            },
            resizeMask (){
                $(this.$refs.winmask).css({
                    'width': $(document).width(),
                    'height': $(document).height()
                });
                return this;
            }
        },
        mounted (){
            var that = this;
            this.$nextTick(function(){
                //that._style();
                that.show();
                that.pos();
                that.resizeMask();
                $(window).resize(function(){
                    that.pos();
                    that.resizeMask();
                });
            });
        }
    }
</script>
<style>
</style>