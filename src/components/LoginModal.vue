<template>
  <div class="modal" v-show="loginModalVisibility">
    <div class="register">
      <div class="registerTitle">
        <button @click="closeModal">X</button>
        <h1>Log In</h1>
      </div>
      <form @submit.prevent="login">
        <BaseInput
          v-model="user.username"
          label="Email"
          type="email"
          :error="errors.email"
          required
        ></BaseInput>
        <BaseInput
          v-model="user.password"
          label="Password"
          type="password"
          :error="errors.password"
          required
        ></BaseInput>
        <button class="submit login" type="submit">Log In</button>
      </form>
      <hr />
      <div class="newToTwitterDiv">
        <h3>New to Twitter?</h3>
        <p>Register now to share your opinion on various topics!</p>
        <button class="submit registerBtn" @click="openRegister">
          Register
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Validation from "@/services/Validation.js";
import axios from "axios";
import LocalStorage from "../services/LocalStorage";
export default {
  props: {
    loginModalVisibility: Boolean,
  },
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      errors: {
        password: "",
        email: "",
      },
    };
  },
  methods: {
    loginRequestSuccess(res) {
      console.log("login success");
      if (res.status !== 200) {
        return;
      }
      console.log("res pri login-u", res.data.user);
      alert("Sign in successful!");
      this.$emit("close");
      this.$router.push("/"); //kad se uloguje ide na svoj home page

      LocalStorage.setUser(res.data.user);
      this.$emit("loggedIn", LocalStorage.getUser());
    },

    loginRequestError(error) {
      console.log(error);
      if (error) {
        if (error.response && error.response.status === 401) {
          alert("Username or password is incorrect");
        }
      }
    },

    login(e) {
      if (!this.errors.email && !this.errors.password) {
        axios
          .post("http://localhost:3000/api/login", this.user)
          .then((res) => {
            this.loginRequestSuccess(res);
          })
          .catch((error) => {
            console.log("err: ", error);
            this.loginRequestError(error);
          });
      } else {
        alert("Please finish your Sign In form");
      }
    },
    openRegister() {
      this.$emit("openRegister");
    },
    closeModal() {
      this.$emit("close");
    },
  },
  watch: {
    "user.username"(newVal, oldVal) {
      if (newVal) {
        Validation.email(newVal);
        this.errors.email = Validation.email(newVal);
      }
    },
    "user.password"(newVal, oldVal) {
      if (newVal) {
        this.errors.password = Validation.password(newVal);
      }
    },
  },
};
</script>
<style scoped>
.birthday {
  padding: 0px;
}
.modal {
  position: fixed;
  z-index: 3000;
  top: 0px;
  left: 0px;
  width: 100%;

  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  /* justify-content: center; */
  align-items: center;
  flex-direction: column;
  padding: 0px 0px 110%;
}
.register {
  width: 640px;
  min-height: 570px;
  background-color: aliceblue;
  padding: 8px 70px;
  margin-top: 50px;
  position: relative;
}
.registerTitle {
  display: flex;
}
.registerTitle h1 {
  margin: 0px;
}
.registerTitle button,
.submit {
  background-color: #b6bdc4;
  padding: 15px 20px;
  border: none;
  font-size: 23px;
  border-radius: 10px;
}
.login {
  margin: 20px 0 10px;
  width: 500px;
}
.registerBtn {
  margin-top: 10px;
  width: 500px;
}
.registerTitle button {
  position: absolute;
  top: 0px;
  left: 0;
  border-radius: 0px;
}
.submit:hover {
  background-color: #6287ad;
}
.submit:active {
  background-color: #397dc1;
}

.registerTitle button:hover {
  background-color: #b5391678;
}
.registerTitle button:active {
  background-color: #b53916cd;
}
.newToTwitterDiv {
  text-align: center;
}
</style>
