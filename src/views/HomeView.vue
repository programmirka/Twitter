<script>
import TweetList from "../components/TweetList.vue";
import LocalStorage from "../services/LocalStorage";
import TweetService from "../services/TweetService";
import ProfileService from "../services/ProfileService";
import newTweet from "@/components/newTweet.vue";
import { watchEffect } from "vue";

export default {
  components: { TweetList, newTweet },
  data() {
    return {
      tweets: [],
      totalTweets: 0,
      profileImagePath: "",
      authUser_id: LocalStorage.id(),
    };
  },
  props: ["page"],
  mounted() {
    this.getTweets();
    ProfileService.getUser(this.authUser_id)
      .then((res) => {
        this.profileImagePath = res.data.data.usr_profilePic;
      })
      .catch((e) => {
        console.error("An error occurred:", e);
      });
    //  TODO: dodaj
  },
  methods: {
    getTweets() {
      watchEffect(() => {
        TweetService.getTweetsHome(5, this.page)
          .then((res) => {
            console.log(this.page);
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
  computed: {
    hasNextPage() {
      // First, calculate total pages
      var totalPages = Math.ceil(this.totalTweets / 5); //

      // Then check to see if the current page is less than the total pages.
      return this.page < totalPages;
    },
  },
};
</script>

<template>
  <main>
    <newTweet
      :profileImagePath="profileImagePath"
      @publishTweet="publishTweet"
    ></newTweet>
    <TweetList
      @likeTweet="likeTweet"
      @dislikeTweet="dislikeTweet"
      @tweetEdited="tweetEdited"
      :tweets="tweets"
      @deleteTweet="tweetDeleted"
    />
    <div class="noTweets" v-if="tweets.length < 1">
      <h2>No Tweets Yet!</h2>
      <p>
        Make your first tweet or follow users in Explore to see their content
        here!
      </p>
    </div>
    <div class="pagination">
      <router-link
        id="page-prev"
        :to="{ name: 'home', query: { page: page - 1 } }"
        rel="prev"
        v-if="page != 1"
      >
        <font-awesome-icon :icon="['fas', 'arrow-left-long']" /> Prev
        Page</router-link
      >
      <router-link
        id="page-next"
        :to="{ name: 'home', query: { page: page + 1 } }"
        rel="next"
        v-if="hasNextPage"
        >Next Page <font-awesome-icon :icon="['fas', 'arrow-right-long']"
      /></router-link>
    </div>
  </main>
</template>
<style>
.noTweets {
  margin-left: 15px;
  padding: 20px;
  color: #34495e;
  font-size: 1.1em;
  text-align: center;
  width: 100%; /* Make it responsive */
  max-width: 800px; /* Your original width */
  margin: auto;
}
.noTweets h2 {
  font-size: 1.2em;
  font-weight: 400;
  text-align: center;
}

@media screen and (min-width: 768px) {
  .noTweets {
    max-width: 800px;
    margin-left: 20px;
  }
}
@media screen and (min-width: 1280px) {
  .noTweets {
    width: 800px;
    margin-left: 20px;
  }
}
</style>
