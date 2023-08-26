<template>
  <Profile
    :user="user"
    :id="authUser_id"
    @openEditProfile="editProfileModVis = true"
    @follow="follow"
  >
  </Profile>
  <NewTweet @publishTweet="publishTweet"></NewTweet>
  <TweetList
    @likeTweet="likeTweet"
    @dislikeTweet="dislikeTweet"
    :tweets="tweets"
    @tweetEdited="tweetEdited"
    @deleteTweet="tweetDeleted"
  ></TweetList>
  <EditProfileModal
    @close="editProfileModVis = false"
    :editProfileModVis="editProfileModVis"
    @editProfileSuccess="editProfileSuccess"
    :id="id"
  ></EditProfileModal>
</template>
<script>
import Profile from "@/components/Profile.vue";
import TweetList from "../components/TweetList.vue";
import EditProfileModal from "../components/EditProfileModal.vue";
import TweetService from "../services/TweetService";
import ProfileService from "../services/ProfileService";
import LocalStorage from "../services/LocalStorage";
import FollowService from "../services/FollowService";
import NewTweet from "@/components/newTweet.vue";

export default {
  components: {
    Profile,
    TweetList,
    EditProfileModal,
    NewTweet,
  },
  data() {
    return {
      tweets: [],
      user: {},
      editProfileModVis: false,
      authUser_id: null,
    };
  },
  props: {
    id: String,
  },
  methods: {
    getTweets() {
      TweetService.getTweets(this.id)
        .then((res) => {
          this.tweets = TweetService.getTweetsSuccess(res);
          console.log(this.tweets);
        })
        .catch((e) => {
          console.error(e);
        });

      this.authUser_id = LocalStorage.id();

      this.getUser();
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
    getUser() {
      ProfileService.getUser(this.id)
        .then((res) => {
          this.user = res.data.data;
          this.user.isFollowing = res.data.isFollowing;

          if (res.data.isAuthenticated) {
            if (res.data.isFollowing) {
              this.user.button = "Unfollow";
            } else {
              this.user.button = "Follow";
            }
          }
        })
        .catch((e) => {
          console.error("An error occurred:", e);
        });
    },
    follow() {
      console.log(this.authUser_id, this.user.usr_id);
      FollowService.newFollow({
        follower_id: this.authUser_id,
        followee_id: this.user.usr_id,
      })
        .then((res) => {
          if (res.data.data === "follow") {
            this.user.button = "Unfollow";
            this.user.isFollowing = true;
          } else {
            this.user.button = "Follow";
            this.user.isFollowing = false;
            console.log(this.user);
          }
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    editProfileSuccess() {
      this.editProfileModVis = false;
      this.getUser();
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
    publishTweet(twt_content) {
      TweetService.publishTweet(twt_content)
        .then((res) => {
          this.getTweets();
        })
        .catch((err) => {
          console.error("An error occured: ", err);
        });
    },
  },
  mounted() {
    this.getTweets();
  },
  watch: {
    id(newValue, oldValue) {
      TweetService.getTweets(newValue)
        .then((res) => {
          this.tweets = TweetService.getTweetsSuccess(res);
        })
        .catch((e) => {
          console.error(e);
        });

      ProfileService.getUser(this.id)
        .then((res) => {
          this.user = res.data.data;
        })
        .catch((e) => {
          console.error("An error occurred:", e);
        });
    },
  },
};
</script>
