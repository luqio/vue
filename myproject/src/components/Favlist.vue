<template>
    <div>
        <div v-for="n in 10">div--{{ msg }}--</div>
    </div>
</template>

<script>
    export default{
        data(){
            return {
                msg: 'hello World'
            }
        }
    }
</script>
<style>
*{
    font-size: 14px;
}
</style>