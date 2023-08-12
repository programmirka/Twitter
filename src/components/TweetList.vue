<template>
  <div>
    <Tweet
      v-for="tweet in tweets"
      :key="tweet.twt_id"
      :usr_name="tweet.usr_name"
      :id="tweet.twt_id"
      :handle="tweet.usr_handle"
      :content="tweet.twt_content"
      :likes="tweet.twt_likes"
      :created="tweet.twt_created"
      :comments="tweet.twt_comments"
      :usr_id="tweet.usr_id"
    ></Tweet>
  </div>
</template>
<script>
import Tweet from "@/components/Tweet.vue";
export default {
  components: {
    Tweet,
  },
  props: {
    tweets: Array,
  },
  methods: {
    //api request za sortiranje, ali kad se klikne dugme, zatim pri refreshu bude opet isto kao iz mounted
    //ne znam jos gde ce ti biti da li ovde ili uparentu
  },
};
</script>
<style scoped></style>
