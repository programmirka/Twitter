<template>
  <div class="follow">
    <div class="profile">
      <img src="@/assets/profile.png" />
      <!-- <RouterLink :to="{ name: 'profile-details', params: { id: usr_id } }"
          >{{ usr_name }} | <span>@{{ handle }}</span> |</RouterLink
        > -->
      <RouterLink :to="{ name: 'profile-details', params: { id: id } }">
        <p>
          {{ name }} |<br />
          <span>{{ handle }}</span>
        </p>
      </RouterLink>
    </div>
    <div>
      <button
        v-if="followers.follower_id"
        :class="{ following: isFollowing }"
        class="followBtn"
        @click="follow"
      >
        {{ followBtn }}
      </button>
      <button v-else class="followBtn">Follow</button>
      <!-- ovde moze at click da bude da ga tera da se uloguje -->
    </div>
  </div>
</template>
<script>
import FollowService from "@/services/FollowService.js";
import LocalStorage from "../services/LocalStorage";
export default {
  props: {
    name: String,
    handle: String,
    id: String,
  },
  data() {
    return {
      followers: {
        follower_id: LocalStorage.id(),
        followee_id: this.id,
      },
      followBtn: "Follow",
      isFollowing: false,
    };
  },
  methods: {
    follow() {
      FollowService.newFollow(this.followers)
        .then((res) => {
          console.log("(Un)Follow Success", res.data);
          if (res.data.data === "follow") {
            this.followBtn = "Unfollow";
            this.isFollowing = true;
          } else {
            this.followBtn = "Follow";
            this.isFollowing = false;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>
<style scoped>
.follow {
  display: flex;
  justify-content: space-between;
  align-items: start;
  width: 80%;
  margin: 20px 5px;
  border-radius: 10px;
  background-color: #6287ad2b;
  padding: 5px 20px;
}
.follow p {
  margin: 0;
}
.profile {
  display: flex;
  margin: 10px;
}
.profile img {
  width: 50px;
  margin-right: 10px;
}
.followBtn {
  background-color: #b6bdc4;
  padding: 20px 30px;
  border-radius: 10px;
  margin: 10px;
  border: none;
}
.followBtn:hover {
  background-color: #6287ad;
}
.followBtn:hover,
.signIn:hover {
  color: #fff;
  cursor: pointer;
}
.following {
  background-color: #6287ad;
}
</style>
