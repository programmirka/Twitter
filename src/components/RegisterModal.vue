<template>
  <div class="modal" v-if="registerModalVisibility">
    <div class="register">
      <div class="registerTitle">
        <span class="close" @click="closeModal"> &times</span>
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
        <!-- <BaseInput
          v-model="user.handle"
          label="Handle"
          type="text"
          :error="errors.handle"
        ></BaseInput> -->
        <label :for="uuid" class="handle"
          ><span class="formLabel">Handle</span>
          <span class="error" v-if="errors.handle">{{ errors.handle }}</span>

          <span class="pre-text">@</span>
          <input id="uuid" v-model="user.handle" class="fieldHandle" />
        </label>
        <legend class="birthday">Birthday</legend>
        <VueDatePicker
          v-model="user.birthday"
          :enable-time-picker="false"
          class="fieldBirthday"
          required
        ></VueDatePicker>

        <br />
        <!-- <div class="birthdaySelect">
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
        </div> -->
        <br />

        <button class="submit registerBtn" type="submit">Register</button>
      </form>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Validation from "@/services/Validation.js";
import UniqueID from "@/services/UniqueID.js";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  props: {
    registerModalVisibility: Boolean,
  },
  data() {
    return {
      user: {
        name: "",
        email: "",
        birthday: "",
        password: "",
        rePassword: "",
        handle: "",
      },

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
        } else if (
          error.response.status === 400 &&
          error.response.data.error.type === "handle"
        ) {
          // console.log(error.response.data.error.type);
          console.log(error.response.status);
          // console.log(error.response.headers);
          alert("Oops! There is already user with that handle, try a new one!");
        }
      }
    },
    register(e) {
      console.log(this.user.birthday);
      // if (this.user.birthday === "") {
      //   return alert("Please finish your form by adding birthday!");
      // }
      let year = this.user.birthday.getFullYear();
      let month = this.user.birthday.getMonth() + 1;
      let day = this.user.birthday.getDate();
      this.user.birthday = year + "-" + month + "-" + day;
      console.log(this.user.birthday);

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
          birth: this.user.birthday,
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
  setup() {
    const uuid = UniqueID().getID();
    return {
      uuid,
    };
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
  background-color: #fff;
  padding: 8px 70px;
  margin-top: 10px;
  position: relative;
  border-radius: 15px;
  box-shadow: -3px 5px 12px -1px rgba(0, 0, 0, 0.559);
}
/* .registerTitle {
  display: flex;
} */
.registerTitle h1 {
  margin: 0px;
  padding: 10px;
  text-align: center;
  color: #34495e;
}
.registerBtn {
  width: 500px;
}

.submit {
  background-color: #b6bdc4;
  padding: 15px 20px;
  border: none;
  font-size: 23px;
  border-radius: 10px;
}
/* .registerTitle button {
  position: absolute;
  top: 0px;
  left: 0;
  border-radius: 0px;
} */
.submit:hover {
  background-color: #6287ad;
}
.submit:active {
  background-color: #397dc1;
}

/* .registerTitle button:hover {
  background-color: #b5391678;
}
.registerTitle button:active {
  background-color: #b53916cd;
} */
.handle {
  position: relative;
}
.fieldHandle {
  font-family: "Montserrat", sans-serif;
  padding: 15px 15px 15px 26px;
  margin: 2px 0 13px;
  font-size: 1em;
  font-weight: 200;
  width: 500px;
  border-radius: 10px;
  border: 0.5px rgba(128, 128, 128, 0.444) solid;
  background-color: rgba(242, 242, 242, 0.706);
}

.fieldBirthday {
  margin: 2px 0 13px;
  font-size: 1em;
  font-weight: 200;
  width: 500px;
  border-radius: 10px;
  border: 0.5px rgba(128, 128, 128, 0.444) solid;
  background-color: rgba(242, 242, 242, 0.706);
}

.formLabel {
  font-size: 1.1em;
  font-weight: 400;
}

.pre-text {
  position: absolute;
  left: 11px;
  top: 51px;
  color: grey;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 1em;
  z-index: 1;
}
.error {
  font-family: "Montserrat", sans-serif;
  color: rgb(160, 92, 92);
  font-size: 0.8em;
  font-weight: 200;
  padding: 1px;
}
</style>
