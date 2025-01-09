<template>
  <Profile
    :user="user"
    :id="authUser_id"
    :profileImagePath="profileImagePath"
    @openEditProfile="editProfileModVis = true"
    @follow="follow"
    @plsLoginModal="plsLoginModal = true"
    @openProfilePicModal="openProfilePicModalHandler"
    @block="block"
  >
  </Profile>
  <NewTweet
    v-if="authUser_id === user.usr_id"
    @publishTweet="publishTweet"
    :profileImagePath="profileImagePath"
  ></NewTweet>
  <TweetList
    @likeTweet="likeTweet"
    @dislikeTweet="dislikeTweet"
    :tweets="tweets"
    @tweetEdited="tweetEdited"
    @deleteTweet="tweetDeleted"
    @plsLoginModal="plsLoginModal = true"
  ></TweetList>
  <EditProfileModal
    v-if="authUser_id"
    @close="editProfileModVis = false"
    :editProfileModVis="editProfileModVis"
    @editProfileSuccess="editProfileSuccess"
    :id="id"
  ></EditProfileModal>
  <UpdateProfilePic
    v-if="openProfilePicModal && authUser_id"
    :profileImagePath="profileImagePath"
    :uploaded="uploaded"
    @uploadProfilePic="uploadProfilePic"
    @handleFileUpload="handleFileUpload"
    @close="openProfilePicModal = false"
  ></UpdateProfilePic>
  <div class="pagination">
    <router-link
      id="page-prev"
      :to="{ name: 'profile-details', query: { page: page - 1 } }"
      rel="prev"
      v-if="page != 1"
      ><font-awesome-icon :icon="['fas', 'arrow-left-long']" />Prev
      Page</router-link
    >
    <router-link
      id="page-next"
      :to="{ name: 'profile-details', query: { page: page + 1 } }"
      rel="next"
      v-if="hasNextPage"
      >Next Page <font-awesome-icon :icon="['fas', 'arrow-right-long']"
    /></router-link>
  </div>

  <PleaseLoginModal
    v-if="plsLoginModal"
    @close="plsLoginModal = false"
  ></PleaseLoginModal>
</template>
<script>
import Profile from "@/components/Profile.vue";
import TweetList from "../components/TweetList.vue";
import EditProfileModal from "../components/EditProfileModal.vue";
import TweetService from "../services/TweetService";
import AdminServices from "../services/AdminServices";
import ProfileService from "../services/ProfileService";
import LocalStorage from "../services/LocalStorage";
import FollowService from "../services/FollowService";
import NewTweet from "@/components/newTweet.vue";
import UpdateProfilePic from "@/components/UpdateProfilePic.vue";
import PleaseLoginModal from "../components/PleaseLoginModal.vue";
import { watchEffect, watchPostEffect } from "vue";
import axios from "axios";

export default {
  components: {
    Profile,
    TweetList,
    EditProfileModal,
    NewTweet,
    PleaseLoginModal,
    UpdateProfilePic,
  },
  data() {
    return {
      tweets: [],
      totalTweets: 0,
      user: {},
      editProfileModVis: false,
      authUser_id: null,
      plsLoginModal: false,
      selectedFile: null,
      openProfilePicModal: false,
      uploaded: false,
      profileImagePath: "",
    };
  },
  props: {
    id: String,
    page: Number,
  },
  methods: {
    getTweets() {
      watchEffect(() => {
        TweetService.getTweets(5, this.page, this.id)
          .then((res) => {
            this.tweets = TweetService.getTweetsSuccess(res);
            console.log(this.tweets);
            this.totalTweets = Object.getOwnPropertyDescriptor(
              res.headers,
              "x-total-count"
            )?.value;
          })
          .catch((e) => {
            console.error(e);
          });
      });
    },
    openProfilePicModalHandler() {
      this.openProfilePicModal = true;
      this.uploaded = false;
    },
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
      console.log(this.selectedFile);
      if (this.selectedFile) {
        this.uploaded = true;
      }
    },
    uploadProfilePic() {
      try {
        const formData = new FormData();
        formData.append("profileImage", this.selectedFile);
        formData.append("userId", this.user.usr_id);

        const response = axios.post(
          "http://localhost:3000/api/uploadProfileImage",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data && response.data.path) {
          this.profileImagePath = response.data.path;
        }
        this.openProfilePicModal = false;
        this.getUser();
        this.getTweets();
      } catch (error) {
        console.error("Error uploading file:", error);
      }
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
      console.log(this.id);
      ProfileService.getUser(this.id)
        .then((res) => {
          this.user = res.data.data;
          console.log(this.user);
          this.user.isFollowing = res.data.isFollowing;
          this.profileImagePath = this.user.usr_profilePic;

          if (res.data.isAuthenticated) {
            if (res.data.isFollowing) {
              this.user.button = "Unfollow";
            } else {
              this.user.button = "Follow";
            }
            if (this.user.usr_blocked) {
              this.user.blockedBtn = "Unblock";
            } else {
              this.user.blockedBtn = "Block";
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
    block() {
      AdminServices.switchBlock(this.user.usr_id)
        .then((res) => {
          this.getUser();
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  mounted() {
    watchEffect(() => {
      this.getTweets();
      this.authUser_id = LocalStorage.id();

      this.getUser();
    });
  },
  watch: {
    id(newValue, oldValue) {
      TweetService.getTweets(2, this.page, newValue)
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
  computed: {
    hasNextPage() {
      // First, calculate total pages
      var totalPages = Math.ceil(this.totalTweets / 5); // 2 is events per page

      // Then check to see if the current page is less than the total pages.
      return this.page < totalPages;
    },
  },
};
</script>
