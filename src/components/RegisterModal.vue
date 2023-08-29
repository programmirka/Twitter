<template>
  <div class="modal" v-if="registerModalVisibility">
    <div class="register">
      <div class="registerTitle">
        <button @click="closeModal">X</button>
        <h1>Register</h1>
      </div>
      <form @submit.prevent="register">
        <BaseInput
          v-model="user.name"
          label="Name"
          type="text"
          :error="errors.name"
          required
        ></BaseInput>
        <BaseInput
          v-model="user.email"
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
        <BaseInput
          v-model="user.rePassword"
          label="Re-enter Password"
          type="password"
          :error="errors.rePassword"
          required
        ></BaseInput>
        <BaseInput
          v-model="user.handle"
          label="Handle"
          type="text"
          :error="errors.handle"
        ></BaseInput>
        <legend class="birthday">Birthday</legend>
        <div class="birthdaySelect">
          <BaseSelect
            :options="month"
            v-model="user.birth.month"
            label="Month"
            vertical
            required
          ></BaseSelect>
          <BaseSelect
            :options="day"
            v-model="user.birth.day"
            label="Day"
            required
          ></BaseSelect>
          <BaseSelect
            :options="year"
            v-model="user.birth.year"
            label="Year"
            required
          ></BaseSelect>
        </div>
        <br />

        <button class="submit registerBtn" type="submit">Register</button>
      </form>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Validation from "@/services/Validation.js";

export default {
  props: {
    registerModalVisibility: Boolean,
  },
  data() {
    return {
      user: {
        name: "",
        email: "",
        password: "",
        rePassword: "",
        handle: "",
        birth: {
          month: "",
          day: "",
          year: "",
        },
      },
      month: Array.from({ length: 12 }, (_, i) => i + 1),
      day: Array.from({ length: 31 }, (_, i) => i + 1),
      year: Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i),
      errors: {
        name: "",
        email: "",
        password: "",
        rePassword: "",
        handle: "",
      },
    };
  },
  methods: {
    registerRequestSuccess(res) {
      console.log("status: ", res.status);
      console.log(res);
      if (res.status === 200) {
        alert(
          "Registration successful!Success! Your account has been created. You can now log in and start using our services"
        );
        this.openLoginModal();
      }
    },
    registerRequestError(error) {
      if (error) {
        if (
          error.response.status === 400 &&
          error.response.data.error.type === "email"
        ) {
          // console.log(error.response.data.error.type);
          console.log(error.response.status);
          // console.log(error.response.headers);
          alert("Oops! There were some problems with your submission.");
        }
      }
    },
    register(e) {
      let birthday =
        this.user.birth.year +
        "-" +
        this.user.birth.month +
        "-" +
        this.user.birth.day;

      if (
        this.errors.name ||
        this.errors.email ||
        this.errors.password ||
        this.errors.rePassword ||
        this.errors.handle
      ) {
        return alert("Please finish your form");
      }
      axios
        .post("http://localhost:3000/api/register", {
          name: this.user.name,
          email: this.user.email,
          password: this.user.password,
          rePassword: this.user.rePassword,
          handle: this.user.handle,
          birth: birthday,
        })
        .then((res) => {
          this.registerRequestSuccess(res);
        })
        .catch((error) => {
          this.registerRequestError(error);
        });
    },
    // axios.post("http://localhost:3000/test");
    closeModal() {
      this.$emit("close");
    },
    openLoginModal() {
      this.$emit("openLoginModal");
    },
  },
  watch: {
    "user.name"(newVal, oldVal) {
      console.log(`Count changed from ${oldVal} to ${newVal}`);
      if (newVal) {
        this.errors.name = Validation.name(newVal);
      }
    },
    "user.email"(newVal, oldVal) {
      console.log(`Count changed from ${oldVal} to ${newVal}`);
      if (newVal) {
        Validation.email(newVal);
        this.errors.email = Validation.email(newVal);
      }
    },
    "user.password"(newVal, oldVal) {
      console.log(`Count changed from ${oldVal} to ${newVal}`);
      if (newVal) {
        this.errors.password = Validation.password(newVal);
      }
    },
    "user.rePassword"(newVal, oldVal) {
      console.log(`Count changed from ${oldVal} to ${newVal}`);
      if (newVal) {
        this.errors.rePassword = Validation.rePassword(
          this.user.password,
          newVal
        );
      }
    },
    "user.handle"(newVal, oldVal) {
      console.log(`Count changed from ${oldVal} to ${newVal}`);
      if (newVal) {
        this.errors.handle = Validation.handle(newVal);
      }
    },
  },
};
</script>
<style scoped>
.birthday {
  padding: 0px;
}
.birthdaySelect {
  display: flex;
}
.modal {
  position: fixed;
  z-index: 3000;
  top: 0px;
  left: 0px;
  width: 100%;

  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 50px 0px 110%;
}
.register {
  width: 650px;
  height: 850px;
  background-color: aliceblue;
  padding: 8px 70px;
  margin-top: 10px;
  position: relative;
}
.registerTitle {
  display: flex;
}
.registerTitle h1 {
  margin: 0px;
}
.registerBtn {
  width: 500px;
}
.registerTitle button,
.submit {
  background-color: #b6bdc4;
  padding: 15px 20px;
  border: none;
  font-size: 23px;
  border-radius: 10px;
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
</style>
