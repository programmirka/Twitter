<template>
  <Profile :user="user" @openEditProfile="editProfileModVis = true"> </Profile>
  <TweetList :tweets="tweets"></TweetList>
  <EditProfileModal
    @close="editProfileModVis = false"
    :editProfileModVis="editProfileModVis"
    @editProfileSuccess="editProfileModVis = false"
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

export default {
  components: {
    Profile,
    TweetList,
    EditProfileModal,
  },
  data() {
    return {
      tweets: [],
      user: {},
      editProfileModVis: false,
      followers: {
        follower_id: String,
        followee_id: String,
      },
    };
  },
  props: {
    id: String,
  },
  mounted() {
    TweetService.getUserTweets(this.id)
      .then((res) => {
        this.tweets = TweetService.getTweetsSuccess(res);
      })
      .catch((e) => {
        console.error(e);
      });

    ProfileService.getAnyUser(this.id)
      .then((res) => {
        this.user = ProfileService.getUserSuccess(res);
        console.log("User u parent-u", this.user);
        if (LocalStorage.id()) {
          this.followers.follower_id = LocalStorage.id();
          this.followers.followee_id = this.id;
          FollowService.checkFollowers(this.followers)
            .then((res) => {
              if (res.data.data === "followers") {
                this.user.button = "Unfollow";
              } else {
                this.user.button = "Follow";
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }
      })
      .catch((e) => {
        console.error("An error occurred:", e);
      });
  },
  watch: {
    id(newValue, oldValue) {
      TweetService.getUserTweets(newValue)
        .then((res) => {
          this.tweets = TweetService.getTweetsSuccess(res);
        })
        .catch((e) => {
          console.error(e);
        });

      ProfileService.getAnyUser(this.id)
        .then((res) => {
          this.user = ProfileService.getUserSuccess(res);
        })
        .catch((e) => {
          console.error("An error occurred:", e);
        });
    },
  },
};
</script>
