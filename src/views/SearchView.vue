<template>
  <div class="searchDivBack">
    <div class="searchDiv">
      <input
        class="field"
        placeholder="Search tweets by #yourTag, #handle or a phrase..."
        v-model="searchTerm"
        @keydown.enter="search"
      />

      <button
        class="replyBtn"
        :disabled="!searchTerm.length"
        @click="search"
        :class="{ disabledButton: !searchTerm.length }"
      >
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
        Search
      </button>
    </div>
  </div>
  <div class="searchResults">
    <TweetList
      :tweets="tweets"
      @likeTweet="likeTweet"
      @dislikeTweet="dislikeTweet"
      @tweetEdited="tweetEdited"
      @deleteTweet="tweetDeleted"
    ></TweetList>
  </div>
  <div class="searchMessage" v-if="noResults">
    <p>
      Oops! We couldn't find any results for that term. Please try a different
      keyword or phrase.
    </p>
  </div>
</template>
<script>
import TweetList from "../components/TweetList.vue";
import SearchServices from "@/services/SearchServices";
import TweetService from "../services/TweetService";

export default {
  data() {
    return {
      searchTerm: "",
      tweets: [],
      noResults: false,
    };
  },
  props: {
    tag: String,
  },
  methods: {
    search() {
      var term = this.searchTerm;

      if (this.searchTerm.indexOf("#") === 0) {
        term = encodeURIComponent(this.searchTerm);
      }

      this.searchService(term);
    },
    searchService(term) {
      SearchServices.getTweets(term)
        .then((res) => {
          this.tweets = res.data.data;
          console.log(res.data.data);
          this.noResults = false;
          if (!res.data.data) {
            this.noResults = true;
          }
        })
        .catch((err) => {
          console.error(err);
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
      this.search();
    },
    tweetDeleted(twt_id) {
      TweetService.deleteTweet(twt_id)
        .then((res) => {
          this.search();
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  components: { TweetList },
  mounted() {
    if (this.tag) {
      console.log(this.tag);
      var tag = encodeURIComponent("#" + this.tag);
      SearchServices.getTweets(tag)
        .then((res) => {
          this.tweets = res.data.data;
          console.log(res.data.data);
          this.noResults = false;
          if (!res.data.data) {
            this.noResults = true;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  },
};
</script>
<style scoped>
.field {
  padding: 15px 10px 20px 10px;
  margin: 8px 0 18px;
  font-family: "Montserrat", sans-serif;
  font-size: 1.1em;
  width: 500px;
  height: 50px;
  resize: none;
  border: 0.5px solid grey;
  border-radius: 20px;
  overflow: hidden;
}
.searchDiv {
  padding: 20px;
  display: flex;
}
.replyBtn {
  border-radius: 20px;
  height: 50px;
  width: 110px;
  font-size: 18px;
  font-weight: 400;
  color: white;
  background-color: #6287ad;
  cursor: pointer;
  margin: 8px 10px 18px;
}
.replyBtn:hover {
  height: 55px;
  width: 112px;
}
.disabledButton {
  background-color: #cacaca5e;
  color: rgba(96, 96, 96, 0.566);
  cursor: auto;
}
.disabledButton:hover {
  height: 50px;
  width: 110px;
}
.searchMessage {
  padding: 15px 10px 20px 10px;
  margin: 8px 0 18px;
  font-style: italic;
  color: grey;
  font-weight: 300;
  width: 500px;
  text-align: center;
  position: fixed;
}
.searchResults {
  padding-top: 140px;
}
.searchDivBack {
  background-color: #f7fbffce;
  position: fixed;
  width: 100%;
  box-shadow: 0px 10px 20px 0px rgba(240, 242, 245, 0.2); /* Adjusted box-shadow for subtleness */
}
</style>
