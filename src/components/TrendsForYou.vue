<template>
  <div class="center">
    <h2>Trends for you</h2>
    <Trend
      v-for="trend in trends"
      :key="trend.tag_id"
      :tag_name="trend.tag_name"
      :twt_number="trend.tweets_number"
      :tag_id="trend.tag_id"
      @plsLoginModal="plsLoginModal"
    ></Trend>
  </div>
</template>
<script>
import Trend from "@/components/Trend.vue";
import HashtagService from "../services/HashtagService";
export default {
  components: {
    Trend,
  },
  data() {
    return {
      trends: [],
    };
  },
  mounted() {
    HashtagService.getTags()
      .then((res) => {
        this.trends = res.data.data;
        console.log(this.trends);
      })
      .catch((err) => {
        console.error(err);
      });
  },
  methods: {
    plsLoginModal() {
      this.$emit("plsLoginModal");
    },
  },
};
</script>
<style scoped>
.center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
