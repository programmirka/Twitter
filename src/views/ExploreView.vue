<template>
  <div>
    <div class="hero">
      <div class="follow">
        <WhoToFollow @plsLoginModal="plsLoginModal = true"></WhoToFollow>
      </div>
      <div class="trends">
        <TrendsForYou @plsLoginModal="plsLoginModal = true"></TrendsForYou>
      </div>
    </div>
    <TweetList
      @likeTweet="likeTweet"
      @dislikeTweet="dislikeTweet"
      :tweets="tweets"
      @tweetEdited="tweetEdited"
      @deleteTweet="tweetDeleted"
      @plsLoginModal="plsLoginModal = true"
    ></TweetList>
    <div class="pagination">
      <router-link
        id="page-prev"
        :to="{ name: 'explore', query: { page: page - 1 } }"
        rel="prev"
        v-if="page != 1"
        ><font-awesome-icon :icon="['fas', 'arrow-left-long']" /> Prev
        Page</router-link
      >
      <router-link
        id="page-next"
        :to="{ name: 'explore', query: { page: page + 1 } }"
        rel="next"
        v-if="hasNextPage"
        >Next Page <font-awesome-icon :icon="['fas', 'arrow-right-long']"
      /></router-link>
    </div>
  </div>
  <PleaseLoginModal
    v-if="plsLoginModal"
    @close="plsLoginModal = false"
  ></PleaseLoginModal>
</template>
<script>
import TweetList from "@/components/TweetList.vue";
import WhoToFollow from "@/components/WhoToFollow.vue";
import TrendsForYou from "@/components/TrendsForYou.vue";
import TweetService from "../services/TweetService";
import { watchEffect } from "vue";
import PleaseLoginModal from "../components/PleaseLoginModal.vue";

export default {
  data() {
    return {
      loggedUser: false,
      tweets: [],
      totalTweets: 0,
      plsLoginModal: false,
    };
  },
  props: ["page"],

  components: {
    TweetList,
    WhoToFollow,
    TrendsForYou,
    PleaseLoginModal,
  },
  mounted() {
    this.getTweets();
  },
  methods: {
    getTweets() {
      watchEffect(() => {
        TweetService.getTweets(5, this.page)
          .then((res) => {
            this.tweets = TweetService.getTweetsSuccess(res);
            this.totalTweets = Object.getOwnPropertyDescriptor(
              res.headers,
              "x-total-count"
            )?.value;
            console.log(this.totalTweets);
            console.log(res.headers);
          })
          .catch((err) => {
            console.error("An error occurred:", err);
          });
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
  computed: {
    hasNextPage() {
      // First, calculate total pages
      var totalPages = Math.ceil(this.totalTweets / 5); //5 is tweets per page

      // Then check to see if the current page is less than the total pages.
      return this.page < totalPages;
    },
  },
};
//Ovde ce mi ici tweetovi svih ljudi sa Twitter-a, ali najpopularniji (najvise lajkova, commentara, i najskoriji (ako moze order by po svemu))
</script>
<style scoped>
.hero {
  display: flex;
  justify-content: space-between;
  padding: 40px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.497);
}
.follow {
  border: 1px solid #34495e2e;
  flex-basis: 49%;
  padding-bottom: 30px;
  border-radius: 10px;
  box-shadow: -1px 3px 12px -1px rgba(0, 0, 0, 0.193);
}
.trends {
  border: 1px solid #34495e2e;
  flex-basis: 49%;
  border-radius: 10px;
  box-shadow: -1px 3px 12px -1px rgba(0, 0, 0, 0.193);
}
</style>
