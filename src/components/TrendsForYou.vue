<template>
<div class="center">
        <h2>Trends for you</h2>
        <Trend v-for="trend in trends" :key="trend.tag_id" :trend="trend.tag_name"></Trend>
    </div>
</template>
<script>
import Trend from '@/components/Trend.vue'
import TrendService from "@/services/TrendService.js"
export default{
    components:{
        Trend
    },
    data(){
        return{
            trends: []
        }
    },
    mounted(){
        TrendService.getTrends().then((res)=>{
            var niz = res.data.data;
            for(var i=0; i<niz.length; i++){
                this.trends.push(new TrendService.Trend(niz[i].tag_id, niz[i].tag_name, niz[i].tag_created))
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