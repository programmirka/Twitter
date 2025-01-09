<template>
  <div class="mainCorner">
    <div class="corner" @click="openLogoutMenu">
      <img
        :src="
          'http://localhost:5173/backend/server/images/' + user.usr_profilePic
        "
      />
      <p>
        @{{ user.usr_handle }}
        <span> <font-awesome-icon :icon="['fas', 'chevron-down']" /></span>
      </p>
    </div>
    <div class="logOut" v-show="corner" @click="logOutBtn">Log Out</div>
  </div>
</template>
<script>
export default {
  props: {
    user: Object,
  },
  data() {
    return {
      corner: false,
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
.corner img {
  border-radius: 50%;
  height: 50px;
  margin-right: 5px;
}
.corner p {
  font-size: 1.25em;
  color: rgba(105, 105, 105, 0.843);
  margin: 0px;
}
.corner span {
  color: black;
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
