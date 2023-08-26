<template>
  <div>
    <div class="hero">
      <div class="follow">
        <WhoToFollow></WhoToFollow>
      </div>
      <div class="trend">
        <TrendsForYou></TrendsForYou>
      </div>
    </div>
    <TweetList
      @likeTweet="likeTweet"
      @dislikeTweet="dislikeTweet"
      :tweets="tweets"
      @tweetEdited="tweetEdited"
      @deleteTweet="tweetDeleted"
    ></TweetList>
  </div>
</template>
<script>
import TweetList from "@/components/TweetList.vue";
import WhoToFollow from "@/components/WhoToFollow.vue";
import TrendsForYou from "@/components/TrendsForYou.vue";
import TweetService from "../services/TweetService";

export default {
  data() {
    return {
      loggedUser: false,
      tweets: [],
    };
  },
  components: {
    TweetList,
    WhoToFollow,
    TrendsForYou,
  },
  mounted() {
    this.getTweets();
  },
  methods: {
    getTweets() {
      TweetService.getTweets()
        .then((res) => {
          this.tweets = TweetService.getTweetsSuccess(res);
          console.log(this.tweets);
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
//Ovde ce mi ici tweetovi svih ljudi sa Twitter-a, ali najpopularniji (najvise lajkova, commentara, i najskoriji (ako moze order by po svemu))
</script>
<style scoped>
.hero {
  display: flex;
  justify-content: space-between;
}
.follow {
  border: 1px solid #34495e2e;
  flex-basis: 48%;
}
.trend {
  border: 1px solid #34495e2e;
  flex-basis: 48%;
  margin-right: 30px;
}
</style>
