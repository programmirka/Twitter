<script>
import TweetList from "../components/TweetList.vue";
import TweetService from "../services/TweetService";
export default {
  components: { TweetList },
  data() {
    return {
      tweets: [],
    };
  },
  mounted() {
    TweetService.getTweets()
      .then((res) => {
        this.tweets = TweetService.getTweetsSuccess(res);
      })
      .catch((err) => {
        console.error("An error occurred:", err);
      });
  },
};
</script>

<template>
  <main>
    <h1>Ovde ce mi ici tweetovi ljudi koje trenutno ulogovana osoba prati</h1>
    <TweetList :tweets="tweets" />
  </main>
</template>
