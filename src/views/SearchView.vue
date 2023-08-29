<template>
  <Search
    @searchTerms="search"
    :placeholder="searchPlaceholder"
    :noResults="noResults"
  ></Search>

  <div class="searchResults">
    <TweetList
      :tweets="tweets"
      @likeTweet="likeTweet"
      @dislikeTweet="dislikeTweet"
      @tweetEdited="tweetEdited"
      @deleteTweet="tweetDeleted"
    ></TweetList>
  </div>
</template>
<script>
import TweetList from "../components/TweetList.vue";
import SearchServices from "@/services/SearchServices";
import TweetService from "../services/TweetService";
import Search from "@/components/Search.vue";

export default {
  components: { TweetList, Search },

  data() {
    return {
      tweets: [],
      noResults: false,
      searchPlaceholder: "Search tweets by #hashtag, @handle or a phrase...",
    };
  },
  props: {
    tag: String,
  },
  methods: {
    search(searchTerm) {
      console.log("search term", searchTerm);
      var term = null;
      if (searchTerm.indexOf("#") === 0) {
        term = encodeURIComponent(searchTerm);
        this.searchService(term);
      } else {
        this.searchService(searchTerm);
      }
    },
    searchService(term) {
      console.log("term", term);
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
.searchResults {
  padding-top: 140px;
}
</style>
