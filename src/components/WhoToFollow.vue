<template>
    <div class="center">
        <h2>Who to follow</h2>
        <Follow v-for="follow in follows" :key="follow.usr_id" :name="follow.usr_name" :handle="follow.usr_handle"></Follow>
    </div>

</template>
<script>
import Follow from '@/components/Follow.vue'
import FollowService from '@/services/FollowService.js'
export default{
    components: {
        Follow
    },
    data(){
        return{
            follows: []
        }
    },
    mounted(){
        FollowService.getFollows().then( (res)=>{
            var niz = res.data.data;
            for(var i=0; i<niz.length; i++){
                this.follows.push(new FollowService.Follow(niz[i].usr_id,niz[i].usr_name, niz[i].usr_handle))
            }
        })

    }
}
</script>
<style scoped>
.center{
    display: flex;
    flex-direction: column;
    align-items: center;
    
}
</style>