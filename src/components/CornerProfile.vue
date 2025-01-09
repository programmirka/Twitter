<template>
  <div class="mainCorner">
    <div class="corner" @click="openLogoutMenu">
      <img :src="imagePath" />
      <p>
        @{{ userHandle }}
        <span> <font-awesome-icon :icon="['fas', 'chevron-down']" /></span>
      </p>
    </div>
    <div class="logOut" v-show="corner" @click="logOutBtn">Log Out</div>
  </div>
</template>
<script>
import { watchEffect } from "vue";

watchEffect;
export default {
  props: {
    user: Object,
  },
  data() {
    return {
      corner: false,
      image: null,
      handle: null,
    };
  },
  methods: {
    openLogoutMenu() {
      this.corner = !this.corner;
    },
    logOutBtn() {
      this.$emit("loggedOut");
    },
  },
  created() {
    // this.userHandle = this.user.usr_handle;
    // this.imagePath = this.usr_profilePic;
  },
  created() {
    this.emitter.on("profilePic", (evt) => {
      console.log(this.image);
      this.image = evt.eventContent;
    });

    this.emitter.on("handle", (evt) => {
      console.log(evt);
      console.log(this.handle);
      this.handle = evt.eventContent;
    });
  },
  computed: {
    imagePath() {
      this.emitter.on("profilePic", (evt) => {
        console.log(this.image);
        this.image = evt.eventContent;
      });
      if (this.image === undefined) {
        console.log("Izvrsava se");
        return (
          "http://localhost:5173/backend/server/images/" +
          this.user.usr_profilePic
        );
      } else if (this.image !== null) {
        console.log(this.image);
        return "http://localhost:5173/backend/server/images/" + this.image;
      } else {
        console.log(this.user.usr_profilePic);
        console.log(this.image);

        return (
          "http://localhost:5173/backend/server/images/" +
          this.user.usr_profilePic
        );
      }
    },
    userHandle() {
      this.emitter.on("handle", (evt) => {
        console.log(evt);
        console.log(this.handle);
        this.handle = evt.eventContent;
      });
      if (this.handle) {
        return this.handle;
      } else {
        return this.user.usr_handle;
      }
    },
  },
};
</script>
<style scooped>
.mainCorner {
  position: relative;
}
/* .corner {
  /* border: 1px solid rgba(128, 128, 128, 0.048); */
/* box-shadow: 2px 2px 5px 2px rgba(61, 120, 157, 0.449);
  background-color: #6287ad15;
  border-radius: 10px;
  padding: 2px 20px;
  cursor: pointer;
  min-width: 100px;
  color: #34495e;
  font-size: 0.99em;
  margin-right: 15px;
}
.corner:hover {
  background-color: #fff;
} */
.corner {
  position: relative;
  margin-right: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
}
.corner:hover {
  cursor: pointer;
}

.corner img {
  border-radius: 50%;
  height: 50px;
  margin-right: 5px;
}
.corner p {
  font-size: 1.1em;
  color: rgba(105, 105, 105, 0.843);
  margin: 0px;
}
.corner span {
  color: black;
  font-size: 1.3em;
}

.corner:hover {
  cursor: pointer;
}
.logOut {
  border: 1px solid;
  border-radius: 10px;
  position: absolute;
  padding: 10px 10px;
  width: 100%;
  background-color: #6287ad;
  color: #fff;
  text-align: center;
  font-size: large;
  font-weight: 700;
  cursor: pointer;
  bottom: -130%;
}
.logOut:active {
  background-color: #34495e;
}
</style>
