<template>
  <div class="mainCorner">
    <div class="corner" @click="openLogoutMenu">
      <p>
        {{ name }} <br /><span>@{{ handle }}</span>
      </p>
    </div>
    <div class="logOut" v-show="corner" @click="logOutBtn">Log Out</div>
  </div>
</template>
<script>
export default {
  props: {
    name: String,
    handle: String,
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
.corner {
  /* border: 1px solid rgba(128, 128, 128, 0.048); */
  box-shadow: 2px 2px 5px 2px rgba(61, 120, 157, 0.449);
  background-color: #6287ad15;
  border-radius: 0 0 0 10px;
  padding: 2px 8px;
  cursor: pointer;
  min-width: 100px;
  color: #34495e;
  font-size: 0.99em;
}
.corner:hover {
  background-color: #fff;
}
.logOut {
  border: 1px solid grey;
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
}
.logOut:active {
  background-color: #34495e;
}
</style>
