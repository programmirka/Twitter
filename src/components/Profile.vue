<template>
  <div class="profileBack">
    <div class="profileBackground"></div>
    <img src="@/assets/profile.png" alt="Profile Picture" />
  </div>
  <div class="profileInfo">
    <button class="editBtn">Edit Profile</button>
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
</template>
<script>
import LocalStorage from "../services/LocalStorage";
import ProfileService from "../services/ProfileService";
export default {
  data() {
    return {
      user: {},
    };
  },
  mounted() {
    let id = LocalStorage.id;
    console.log("id usera", id);
    if (id) {
      ProfileService.getUser(id)
        .then((res) => {
          this.user = ProfileService.getUserSuccess(res);
        })
        .catch((e) => {
          console.error("An error occurred:", e);
        });
    }
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
