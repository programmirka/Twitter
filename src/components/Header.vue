<template>
  <header class="header">
    <p class="logo">
      <a href="#"><font-awesome-icon icon="fa-brands fa-twitter" /> Twitter</a>
    </p>
    <CornerProfile
      :user="storedUser"
      v-if="loggedUser"
      @loggedOut="loggedOutHandler"
    />
    <div v-if="!loggedUser" class="signIn" @click="loginModalVisibility = true">
      <p><font-awesome-icon :icon="['far', 'user']" /> LOG IN</p>
    </div>
  </header>
  <RegisterModal
    @close="registerModVis = false"
    :registerModalVisibility="registerModVis"
    @openLoginModal="openLogin"
  ></RegisterModal>

  <LoginModal
    @openRegister="openRegister"
    @close="loginModalVisibility = false"
    :loginModalVisibility="loginModalVisibility"
    @loggedIn="loggedInHandler"
  ></LoginModal>
</template>
<script>
import RegisterModal from "./RegisterModal.vue";
import LoginModal from "./LoginModal.vue";
import CornerProfile from "./CornerProfile.vue";
import LocalStorage from "../services/LocalStorage";
import axios from "axios";

export default {
  emits: ["loggedUserNavTrue", "loggedUserNavFalse"],
  components: {
    CornerProfile,
    RegisterModal,
    LoginModal,
  },
  data() {
    return {
      loggedUser: false,
      storedUser: Object, //koristim za ostale funkcionalnosti, npm storedUser.usr_id
      loginModalVisibility: false,
      registerModVis: false,
      name: "",
      handle: "",
    };
  },
  methods: {
    openRegister() {
      this.loginModalVisibility = false;
      this.registerModVis = true;
    },

    openLogin() {
      this.loginModalVisibility = true;
      this.registerModVis = false;
    },

    loggedInHandler(storedUser) {
      try {
        this.loggedUser = true;
        this.storedUser = storedUser;

        this.name = this.storedUser.usr_name;
        this.handle = this.storedUser.usr_handle;

        this.$emit("loggedUserNavTrue"); //emitujemo parentu (app) iz koga nav componenta uzima vrednost loggedUserNav
      } catch (e) {
        alert(new Error(e));
      }
    },
    loggedOutHandler() {
      axios
        .post("http://localhost:3000/api/logout")
        .then((res) => {
          this.loggedUser = false;
          this.storedUser = null;
          LocalStorage.removeUser();
          this.name = "";
          this.handle = "";
          this.$emit("loggedUserNavFalse");
          this.$router.push("/");
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  mounted() {
    console.log("mounted");
    // TODO: Extract to a separate function (for example deserializeUser), poseban fajl probaj
    if (localStorage.getItem("loggedInUser")) {
      this.loggedUser = true;

      this.storedUser = LocalStorage.getUser();
      this.name = this.storedUser.usr_name;
      this.handle = this.storedUser.usr_handle;
    }
  },
  watch: {
    storedUser(newVal, oldVal) {
      console.log("new Pic", newVal);
      console.log("old Pic", oldVal);
    },
  },
};
</script>
<style scooped>
* {
  box-sizing: border-box;
}

.signIn {
  background-color: #6287ad;
  color: aliceblue;
  padding: 10px 15px;
  border-radius: 10px;
  margin-right: 10px;
}
.signIn p {
  margin: 0px;
}
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
h2,
h3,
a {
  color: #34495e;
}
a {
  text-decoration: none;
}
.logo {
  margin: 0;
  font-size: 1.3em;
}
.logo a {
  text-transform: uppercase;
  text-align: center;
  display: block;
}

a.routher-link {
  color: #34495e;
  font-size: 0.99em;
}

.header {
  border: 1px solid #a2a2a2;
  background-color: #f4f4f4;
  box-shadow: -1px 3px 12px -1px rgba(0, 0, 0, 0.299);
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 80px;
}
</style>
