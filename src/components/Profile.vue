<template>
  <div v-if="user">
    <div class="profileBack">
      <div class="profileBackground"></div>
      <div class="image-container">
        <img
          v-if="id === user.usr_id"
          src="http://localhost:5173/changePicHover.jpeg"
          alt="Overlay"
          :style="{ opacity: hovering ? '0.9' : '0' }"
          class="overlay-image"
        />
        <img
          @click="UpdateProfilePic"
          :src="
            'http://localhost:5173/backend/server/images/' + profileImagePath
          "
          alt="User's profile picture"
          class="profile-image"
          :style="{ opacity: hovering && id === user.usr_id ? '0.1' : '1' }"
          @mouseover="handleMouseOver"
          @mouseout="handleMouseOut"
        />
      </div>
    </div>

    <div class="profileInfo">
      <div class="buttons">
        <button
          @click="block"
          v-if="admin && adminId !== user.usr_id"
          class="adminDeleteBtn"
        >
          {{ user.blockedBtn }}

          <!-- Your login request could not be completed at this time. For further assistance, please contact our customer support. -->
        </button>
        <button v-else-if="id === user.usr_id" class="editBtn" @click="edit">
          Edit Profile
        </button>

        <button
          v-else-if="id"
          :class="{ followBtn: user.isFollowing }"
          class="editBtn"
          @click="follow"
        >
          {{ user.button }}
        </button>
        <button v-else @click="plsLoginModal" class="editBtn">Follow</button>
      </div>

      <!-- TODO:ovde ce ici neka f-ja koja ce reci user-u da se loginuje -->
      <h3>
        {{ user.usr_name }} | <br />
        <span class="handle">@{{ user.usr_handle }}</span>
      </h3>
      <p class="about mainColor">{{ user.usr_about }}</p>
      <div class="joined">
        <font-awesome-icon :icon="['far', 'calendar']" /> Joined {{ joined }}
      </div>
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
import CreatedService from "../services/CreatedService";

export default {
  data() {
    return {
      admin: LocalStorage.admin(),
      adminId: LocalStorage.adminId(),
      hovering: false,
    };
  },
  props: {
    user: Object,
    id: [Number, String],
    profileImagePath: String,
  },
  methods: {
    edit() {
      this.$emit("openEditProfile");
    },
    follow() {
      //TODO: prebaci u profile view
      this.$emit("follow");
      console.log("sta se desava");
    },
    plsLoginModal() {
      this.$emit("plsLoginModal");
    },
    block() {
      this.$emit("block");
    },
    // handleFileUpload(event) {
    //   this.$emit("handleFileUpload", event);
    // },
    handleMouseOver() {
      console.log("Mouse over triggered");

      this.hovering = true;
    },
    handleMouseOut() {
      console.log("Mouse out triggered");
      this.hovering = false;
    },
    UpdateProfilePic() {
      console.log(this.id, this.user.usr_id);
      if (this.id === this.user.usr_id) {
        this.$emit("openProfilePicModal");
      } else {
        return;
      }
    },
  },
  computed: {
    joined() {
      var day = CreatedService.day(this.user.usr_joined);
      var month = CreatedService.month(this.user.usr_joined);
      var year = CreatedService.year(this.user.usr_joined);

      return day + "-" + month + "-" + year;
    },
  },
};
</script>
<style scoped>
.profileBackground {
  height: 200px;
  margin: -30px -15px 0px;
  background-image: url(@/assets/jean-philippe-delberghe-75xPHEQBmvA-unsplash.jpg);
  background-attachment: fixed;
  background-size: cover;
  opacity: 0.3;
  border-bottom: 30px solid rgba(128, 128, 128, 0.113);
}
.profileBack {
  position: relative;
}

.profileInfo {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  padding-bottom: 30px;
  padding-top: 100px;
  border-bottom: 2px solid rgba(128, 128, 128, 0.064);
  position: relative;
}
.profileInfo h3 {
  margin: 0px;
}
.editBtn {
  height: 50px;
  width: 100px;
  margin-top: 15px;
  margin-right: 15px;
  border-radius: 15px;
  border: 1px solid grey;
  cursor: pointer;
  font-size: 1.1em;
  color: rgba(0, 0, 0, 0.641);
}

.editBtn:hover {
  background-color: aliceblue;
  color: rgba(0, 0, 0, 0.847);
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
.followBtn {
  background-color: #6287ad;
}
.buttons {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
}

.image-container {
  margin-left: 20px;
  bottom: -75px;
  left: 0;
  position: absolute;
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 50%;
  border: #fff solid 6px;
  box-sizing: content-box;
  z-index: 100;
}
.profile-image {
  width: 150px;
  position: absolute;
  top: 0%;
  left: 0%;
  z-index: 102;
}

.overlay-image {
  width: 150px;
}

.profile-image:active {
  opacity: 0.5;
}

.overlay-image {
  z-index: 101;
}
</style>
