<template>
  <div v-if="user">
    <div class="profileBack">
      <div class="profileBackground"></div>
      <img src="@/assets/profile.png" alt="Profile Picture" />
    </div>
    <div class="profileInfo">
      <button v-if="id === user.usr_id" class="editBtn" @click="edit">
        Edit Profile
      </button>
      <button v-else class="editBtn" @click="follow">{{ user.button }}</button>
      <h3>
        {{ user.usr_name }} | <br />
        <span class="handle">@{{ user.usr_handle }}</span>
      </h3>
      <p class="about">{{ user.usr_about }}</p>
      <div class="joined">{{ user.usr_joined }}</div>
      <div class="following">
        <span
          ><b>{{ user.following }}</b> Following</span
        ><span
          ><b>{{ user.followers }}</b> Followers</span
        >
      </div>
    </div>
  </div>
</template>
<script>
import FollowService from "../services/FollowService";
import LocalStorage from "../services/LocalStorage";
import ProfileService from "../services/ProfileService";

export default {
  data() {
    return {
      id: String,
      followers: {
        follower_id: String,
        followee_id: String,
      },
    };
  },
  props: {
    user: Object,
  },
  beforeMount() {
    if (LocalStorage.id()) {
      this.id = LocalStorage.id();
      this.followers.follower_id = this.id;
    }
  },
  watch: {
    followBtn(newVal, OldVal) {
      if (newVal && !OldVal) {
        this.followBtn = this.followBtnParent;
      }
    },
  },
  methods: {
    edit() {
      this.$emit("openEditProfile");
    },
    follow() {
      console.log("this followers", this.followers);

      this.followers.followee_id = this.user.usr_id;
      FollowService.newFollow(this.followers)
        .then((res) => {
          if (res.data.data === "follow") {
            this.user.button = "Unfollow";
          } else {
            this.user.button = "Follow";
          }
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>
<style scoped>
.profileBackground {
  height: 200px;
  background-image: url(@/assets/jean-philippe-delberghe-75xPHEQBmvA-unsplash.jpg);
  background-attachment: fixed;
  background-size: cover;
  opacity: 0.3;
  border-bottom: 30px solid rgba(128, 128, 128, 0.113);
}
.profileBack {
  position: relative;
  z-index: -10;
}
img {
  height: 130px;
  position: absolute;
  bottom: 0px;
  bottom: -65px;
  margin-left: 20px;
}
.profileInfo {
  display: flex;
  flex-direction: column;
  border-top: 30px solid rgba(128, 128, 128, 0.047);
  margin-left: 20px;
  padding-bottom: 30px;
  border-bottom: 2px solid rgba(128, 128, 128, 0.064);
}
.profileInfo h3 {
  margin: 0px;
}
.editBtn {
  flex-basis: 60px;
  width: 100px;
  align-self: flex-end;
  margin-top: 15px;
  margin-right: 15px;
  border-radius: 15px;
  border: 1px solid grey;
  cursor: pointer;
  font-size: 1.1em;
}
.editBtn:hover {
  background-color: aliceblue;
}
.handle,
.following,
.joined {
  color: rgba(0, 0, 0, 0.209);
}
.handle {
  font-weight: 200;
  font-size: 0.9em;
}
.following span {
  margin-right: 30px;
  font-size: 1.2em;
}
.about {
  width: 800px;
}
.joined {
  margin-top: 15px;
  margin-bottom: 10px;
}
</style>
