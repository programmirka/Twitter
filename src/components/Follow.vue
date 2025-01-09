<template>
  <div class="follow">
    <div class="profile">
      <img :src="'http://localhost:5173/backend/server/images/' + profilePic" />
      <!-- <RouterLink :to="{ name: 'profile-details', params: { id: usr_id } }"
          >{{ usr_name }} | <span>@{{ handle }}</span> |</RouterLink
        > -->
      <RouterLink :to="{ name: 'profile-details', params: { id: id } }">
        <p>
          {{ name }} |<br />
          <span>@{{ handle }}</span>
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
      <button v-else @click="plsLoginModal" class="followBtn">Follow</button>
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
    profilePic: String,
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
    plsLoginModal() {
      this.$emit("plsLoginModal");
    },
  },
};
</script>
<style scoped>
.follow {
  width: 80%;
  margin: 5px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  background-color: #6287ad2b;
  padding: 5px 15px;
  height: 80px;
  font-size: 0.7em;
  transition: ease 3s;
}
.follow:hover {
  background-color: aliceblue;
  border: 0.5px solid #6287ad;
}
.follow p {
  margin: 0;
}
.profile {
  display: flex;
  margin: 3px;
}
.profile img {
  width: 40px;
  height: 40px;
  margin-right: 5px;
  border-radius: 50%;
}
.followBtn {
  background-color: #ffffff7e;
  border: 0.1px solid #6287ad69;
  padding: 15px 30px;
  border-radius: 10px;
  margin: 10px;
  color: #34495e;
  font-size: 1em;
}
.followBtn:hover {
  background-color: #6287ad;
  color: white;
  cursor: pointer;
}

.signIn:hover {
  color: #fff;
  cursor: pointer;
}
.following {
  background-color: #6287ad;
  color: #fff;
}
a:hover {
  color: #6287ad;
}

@media screen and (min-width: 1280px) {
  .profile img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  .profile {
    margin: 10px;
  }
  .follow {
    padding: 5px 20px;
    font-size: 0.9em;
    transition: ease 3s;
  }
}
</style>
