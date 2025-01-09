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
  <div class="pagination">
    <router-link
      id="page-prev"
      :to="{ name: 'search', query: { page: page - 1 } }"
      rel="prev"
      v-if="page != 1"
      ><font-awesome-icon :icon="['fas', 'arrow-left-long']" /> Prev
      Page</router-link
    >
    <router-link
      id="page-next"
      :to="{ name: 'search', query: { page: page + 1 } }"
      rel="next"
      v-if="hasNextPage"
      >Next Page <font-awesome-icon :icon="['fas', 'arrow-right-long']"
    /></router-link>
  </div>
</template>
<script>
import TweetList from "../components/TweetList.vue";
import SearchServices from "@/services/SearchServices";
import TweetService from "../services/TweetService";
import Search from "@/components/Search.vue";
import { watchEffect } from "vue";

export default {
  components: { TweetList, Search },

  data() {
    return {
      tweets: [],
      totalTweets: 0,
      noResults: false,
      searchPlaceholder: "Search tweets by #hashtag, @handle or a phrase...",
    };
  },
  props: {
    tag: String,
    page: Number,
  },
  methods: {
    search(searchTerm) {
      if (searchTerm.trim()) {
        console.log("search term", searchTerm);
        var term = null;
        if (searchTerm.indexOf("#") === 0) {
          term = encodeURIComponent(searchTerm);
          this.searchService(term);
          this.noResults = true;
        } else {
          this.searchService(searchTerm);
        }
      }
    },
    searchService(term) {
      console.log("term", term);
      console.log(this.page);
      watchEffect(() => {
        SearchServices.getTweets(4, this.page, term)
          .then((res) => {
            this.tweets = res.data.data;
            console.log(res.data.data);
            this.noResults = false;
            if (!res.data.data) {
              this.noResults = true;
            }
            this.totalTweets = Object.getOwnPropertyDescriptor(
              res.headers,
              "x-total-count"
            )?.value;
            console.log(this.totalTweets);
          })
          .catch((err) => {
            console.error(err);
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
      watchEffect(() => {
        SearchServices.getTweets(4, this.page, tag)
          .then((res) => {
            this.tweets = res.data.data;
            console.log(res.data.data);
            this.noResults = false;
            if (!res.data.data) {
              this.noResults = true;
            }
            this.totalTweets = Object.getOwnPropertyDescriptor(
              res.headers,
              "x-total-count"
            )?.value;
          })
          .catch((err) => {
            console.error(err);
          });
      });
    }
  },
  computed: {
    hasNextPage() {
      // First, calculate total pages
      var totalPages = Math.ceil(this.totalTweets / 4); // 5 is tweets per page

      // Then check to see if the current page is less than the total pages.
      return this.page < totalPages;
    },
  },
};
</script>
<style>
.searchResults {
  padding-top: 140px;
}
</style>
