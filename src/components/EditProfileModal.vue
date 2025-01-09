<template>
  <div class="modal" v-show="editProfileModVis && id">
    <div class="editProfile">
      <div class="editProfileTitle">
        <span class="close" @click="closeModal"> &times</span>
        <h1>Edit Profile</h1>
      </div>
      <form @submit.prevent="submitEdit">
        <BaseInput
          v-model="user.name"
          label="Name"
          type="text"
          :error="errors.name"
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
        <BaseTextarea
          v-model="user.about"
          label="About"
          type="text"
          :error="errors.about"
          :dp__theme_light="true"
        >
        </BaseTextarea>
        <legend class="formLabel">Birthday</legend>
        <VueDatePicker
          v-model="user.birthday"
          :enable-time-picker="false"
          class="fieldBirthday"
        ></VueDatePicker>

        <br />
        <p class="passLabel">
          <em>To change the password please enter new password two times</em>
        </p>

        <BaseInput
          v-model="user.password"
          label="Password"
          type="password"
          :error="errors.password"
        ></BaseInput>
        <BaseInput
          v-model="user.rePassword"
          label="Re-enter Password"
          type="password"
          :error="errors.rePassword"
        ></BaseInput>

        <br />

        <button class="submit" type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>
<script>
import CreatedService from "@/services/CreatedService.js";
import EditProfileService from "@/services/EditProfileService.js";
import LocalStorage from "../services/LocalStorage";
import Validation from "../services/Validation.js";
import UniqueID from "@/services/UniqueID.js";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  props: {
    editProfileModVis: Boolean, //treba da imamo u ProfilView na dugme edit da se lokalni data boolean za editProfileModalVisibility
    id: [String, Number],
  },
  components: { VueDatePicker },
  //polja nece biti prazna vec cu odmah u mountu za ovog user-a da ucitam trenutne podatke u input
  data() {
    return {
      user: {
        name: "",
        handle: "",
        about: "",
        birthday: "",
        password: "",
        rePassword: "",
      },
      errors: {
        name: "",
        password: "",
        rePassword: "",
        handle: "",
        about: "",
      },
      authUser_id: LocalStorage.id(),
      oldBirthday: null,
      oldHandle: String,
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
      this.loadEditProfile();
    },
    submitEdit() {
      if (
        this.errors.name ||
        this.errors.password ||
        this.errors.rePassword ||
        this.errors.handle ||
        this.errors.about
      ) {
        return alert("Please finish your form");
      }

      console.log("stari rodj", this.oldBirthday);
      console.log("novi rodj", this.user.birthday);

      if (this.oldBirthday !== this.user.birthday) {
        let year = this.user.birthday.getFullYear();
        let month = this.user.birthday.getMonth() + 1;
        let day = this.user.birthday.getDate();
        this.user.birthday = year + "-" + month + "-" + day;
      } else {
        let parts = this.user.birthday.split("/");
        this.user.birthday = parts[2] + "-" + parts[0] + "-" + parts[1];
      }

      EditProfileService.editProfile(this.id, this.user)
        .then((res) => {
          alert("Change is successfully submitted!");
          console.log(res.data);

          this.$emit("editProfileSuccess"); //posle upisi u profile view, da se sakrije modal
          if (this.oldHandle != this.user.handle) {
            this.emitter.emit("handle", {
              eventContent: this.user.handle,
            });
          }
          this.loadEditProfile();
        })
        .catch((error) => {
          if (
            error.response.status === 400 &&
            error.response.data.error.type === "handle"
          ) {
            // console.log(error.response.data.error.type);
            console.log(error.response.status);
            // console.log(error.response.headers);
            alert(
              "Oops! There is already user with that handle, try a new one!"
            );
          }
        });
    },
    loadEditProfile() {
      if (this.id === this.authUser_id) {
        EditProfileService.openEditProfile(this.id)
          .then((res) => {
            let userDB = res.data.data;
            this.user.name = userDB.usr_name;
            this.user.email = userDB.usr_email;
            this.user.handle = userDB.usr_handle;
            this.user.about = userDB.usr_about;
            this.oldBirthday =
              parseInt(CreatedService.month(userDB.usr_birth)) +
              "/" +
              parseInt(CreatedService.day(userDB.usr_birth)) +
              "/" +
              CreatedService.year(userDB.usr_birth);

            this.user.birthday = this.oldBirthday;
            this.oldHandle = this.user.handle;
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
  },
  setup() {
    const uuid = UniqueID().getID();
    return {
      uuid,
    };
  },

  mounted() {
    this.loadEditProfile();
  },
  watch: {
    "user.name"(newVal, oldVal) {
      console.log(`Count changed from ${oldVal} to ${newVal}`);
      if (newVal) {
        this.errors.name = Validation.name(newVal);
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
    "user.about"(newVal, oldVal) {
      console.log(`Count changed from ${oldVal} to ${newVal}`);
      if (newVal) {
        this.errors.about = Validation.about(newVal);
      }
    },
    id(newVal, oldVal) {
      if (newVal) {
        return this.loadEditProfile();
      }
    },
  },
};
</script>
<style>
.passLabel {
  margin: 0px;
  font-size: 1.1em;
  border-top: grey 0.5px solid;
  padding-top: 20px;
}
.editProfile {
  width: 650px;
  min-height: 880px;
  background-color: #fff;
  padding: 8px 70px;
  margin-top: 15px;
  position: relative;
  border-radius: 15px;
  box-shadow: -3px 5px 12px -1px rgba(0, 0, 0, 0.559);
}

.editProfileTitle h1 {
  margin: 0px;
  padding: 10px;
  text-align: center;
  color: #34495e;
}

.submit {
  background-color: #b6bdc4;
  padding: 15px 20px;
  border: none;
  font-size: 23px;
  border-radius: 10px;
  margin: -15px 0 15px;
  width: 500px;
}
.submit:hover {
  background-color: #6287ad;
}
.submit:active {
  background-color: #397dc1;
}

.error {
  font-family: "Montserrat", sans-serif;
  color: rgb(160, 92, 92);
  font-size: 0.8em;
  font-weight: 200;
  padding: 1px;
}
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
  box-shadow: 0px 3px 10px -1px rgba(0, 0, 0, 0.233);
}

.fieldBirthday {
  margin: 2px 0 13px;
  font-size: 1em;
  font-weight: 200;
  width: 500px;
  border-radius: 10px;
  border: 0.5px rgba(128, 128, 128, 0.444) solid;
  background-color: rgba(242, 242, 242, 0.706);
  box-shadow: 0px 3px 10px -1px rgba(0, 0, 0, 0.233);
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
</style>
