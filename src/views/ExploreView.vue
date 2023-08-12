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
    <TweetList :tweets="tweets"></TweetList>
  </div>
</template>
<script>
import TweetList from "@/components/TweetList.vue";
import TweetService from "../services/TweetService";
import WhoToFollow from "@/components/WhoToFollow.vue";
import TrendsForYou from "@/components/TrendsForYou.vue";
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
    TweetService.getTweets()
      .then((res) => {
        this.tweets = TweetService.getTweetsSuccess(res);
      })
      .catch((err) => {
        console.error("An error occurred:", err);
      });
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
