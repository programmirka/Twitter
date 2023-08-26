<script>
import TweetList from "../components/TweetList.vue";
import TweetService from "../services/TweetService";
import newTweet from "@/components/newTweet.vue";

export default {
  components: { TweetList, newTweet },
  data() {
    return {
      tweets: [],
    };
  },
  mounted() {
    this.getTweets();
  },
  methods: {
    getTweets() {
      TweetService.getTweets()
        .then((res) => {
          this.tweets = TweetService.getTweetsSuccess(res);
        })
        .catch((err) => {
          console.error("An error occurred:", err);
        });
    },
    likeTweet(twt_id) {
      for (var i = 0; i < this.tweets.length; i++) {
        if (this.tweets[i].twt_id === twt_id) {
          this.tweets[i].twt_likes++;
          this.tweets[i].twt_liked = true;
        }
      }
    },
    dislikeTweet(twt_id) {
      for (var i = 0; i < this.tweets.length; i++) {
        if (this.tweets[i].twt_id === twt_id) {
          this.tweets[i].twt_likes--;
          this.tweets[i].twt_liked = false;
        }
      }
    },
    tweetEdited() {
      this.getTweets();
    },
    publishTweet(newTweet) {
      TweetService.publishTweet(newTweet)
        .then((res) => {
          this.getTweets();
        })
        .catch((err) => {
          console.error("An error occured: ", err);
        });
    },
    tweetDeleted(twt_id) {
      TweetService.deleteTweet(twt_id)
        .then((res) => {
          this.getTweets();
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>

<template>
  <main>
    <newTweet @publishTweet="publishTweet"></newTweet>
    <TweetList
      @likeTweet="likeTweet"
      @dislikeTweet="dislikeTweet"
      @tweetEdited="tweetEdited"
      :tweets="tweets"
      @deleteTweet="tweetDeleted"
    />
  </main>
</template>
