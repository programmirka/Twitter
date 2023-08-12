<template>
  <Profile></Profile>
  <TweetList :tweets="tweets"></TweetList>
</template>
<script>
import Profile from "@/components/Profile.vue";
import TweetList from "../components/TweetList.vue";
import TweetService from "../services/TweetService";

export default {
  components: {
    Profile,
    TweetList,
  },
  data() {
    return {
      tweets: [],
    };
  },
  props: {
    id: String,
  },
  mounted() {
    TweetService.getUserTweets(this.id)
      .then((res) => {
        this.tweets = TweetService.getTweetsSuccess(res);
      })
      .catch((e) => {
        console.error(e);
      });
  },
  watch: {
    id(newValue, oldValue) {
      TweetService.getUserTweets(newValue)
        .then((res) => {
          this.tweets = TweetService.getTweetsSuccess(res);
        })
        .catch((e) => {
          console.error(e);
        });
    },
  },
};
</script>
