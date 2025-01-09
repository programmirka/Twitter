<template>
  <div>
    <Tweet
      v-for="tweet in tweets"
      :key="tweet.twt_id"
      :usr_name="tweet.usr_name"
      :id="tweet.twt_id"
      :handle="tweet.usr_handle"
      :content="tweet.twt_content"
      :created="tweet.twt_created"
      :comments="tweet.twt_comments"
      :usr_id="tweet.usr_id"
      :likes="tweet.twt_likes"
      :liked="tweet.twt_liked"
      :profileImagePath="tweet.usr_profilePic"
      @likeTweet="likeTweet"
      @dislikeTweet="dislikeTweet"
      @deleteTweet="deleteTweet"
      @editTweet="editTweet"
      @plsLoginModal="plsLoginModal"
    ></Tweet>
  </div>
</template>
<script>
import Tweet from "@/components/Tweet.vue";
import TweetService from "../services/TweetService";
export default {
  components: {
    Tweet,
  },
  props: {
    tweets: Array,
  },

  methods: {
    likeTweet(twt_id) {
      this.$emit("likeTweet", twt_id);
    },
    dislikeTweet(twt_id) {
      this.$emit("dislikeTweet", twt_id);
    },
    deleteTweet(twt_id) {
      this.$emit("deleteTweet", twt_id);
    },
    editTweet(object) {
      TweetService.editTweet(object)
        .then((res) => {
          this.$emit("tweetEdited");
        })
        .catch((err) => {
          console.error(err);
        });
    },
    plsLoginModal() {
      this.$emit("plsLoginModal");
    },
    //api request za sortiranje, ali kad se klikne dugme, zatim pri refreshu bude opet isto kao iz mounted
    //ne znam jos gde ce ti biti da li ovde ili uparentu
  },
};

// if (this.$route.path === '/home') {
//    // The current route is "/home"
// }
</script>
<style></style>
