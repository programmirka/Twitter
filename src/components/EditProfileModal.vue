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
        >
        </BaseTextarea>
        <legend class="formLabel">Birthday</legend>
        <VueDatePicker
          v-model="date"
          :enable-time-picker="false"
          :dp__theme_light="false"
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
        password: "",
        rePassword: "",
        handle: "",
        about: "",
      },
      birthday: "",
      authUser_id: LocalStorage.id(),
      date: null,
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
      this.user.birthday =
        this.user.birth.year +
        "-" +
        this.user.birth.month +
        "-" +
        this.user.birth.day;

      EditProfileService.editProfile(this.id, this.user)
        .then((res) => {
          alert("Change is successfully submitted!");
          console.log(res.data);
          this.$emit("editProfileSuccess"); //posle upisi u profile view, da se sakrije modal
        })
        .catch((error) => {
          console.error(error);
        });
    },
    loadEditProfile() {
      if (this.id === this.authUser_id) {
        EditProfileService.openEditProfile(this.id)
          .then((res) => {
            let userDB = res.data.data;
            console.log("user DB", userDB);
            this.user.name = userDB.usr_name;
            this.user.email = userDB.usr_email;
            this.user.handle = userDB.usr_handle;
            this.user.about = userDB.usr_about;
            this.user.birth.day = parseInt(
              CreatedService.day(userDB.usr_birth)
            );
            this.user.birth.month = parseInt(
              CreatedService.month(userDB.usr_birth)
            );
            this.user.birth.year = CreatedService.year(userDB.usr_birth);

            console.log(userDB.usr_birth);
            console.log(
              "day",
              this.user.birth.day,
              "month",
              this.user.birth.month,
              "year",
              this.user.birth.year
            );
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
  //     editProfileRequestSuccess(res) {},
  //     editProfileRequestError(error) {
  //       if (error) {
  //       }
  //     },
  //   },
  //   editProfile(e) {
  //     axios
  //       .post("http://localhost:3000/api/editProfile", {
  //         name: this.user.name,
  //         email: this.user.email,
  //         password: this.user.password,
  //         rePassword: this.user.rePassword,
  //         handle: this.user.handle,
  //         birth: birthday,
  //       })
  //       .then((res) => {
  //         editProfileRequestSuccess(res);
  //       })
  //       .catch((error) => {
  //         editProfileRequestError(error);
  //       });
  //   },

  // axios.post("http://localhost:3000/test");
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
<style scoped>
.passLabel {
  margin: 0px;
}
.editProfile {
  width: 650px;
  min-height: 880px;
  background-color: aliceblue;
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
  margin: 0px 0 15px;
  width: 500px;
}
.submit:hover {
  background-color: #6287ad;
}
.submit:active {
  background-color: #397dc1;
}

.error {
  color: red;
  font-size: 0.9em;
  padding: 1px;
}
.handle {
  position: relative;
}
.fieldHandle {
  padding: 15px 15px 15px 26px;
  margin: 2px 0 13px;
  font-size: 1.1em;
  width: 500px;
  border-radius: 10px;
  border: 0.5px grey solid;
  background-color: rgb(242, 242, 242);
}

.fieldBirthday {
  margin: 2px 0 13px;
  font-size: 1.1em;
  width: 500px;
  border-radius: 10px;
  border: 0.5px grey solid;
  color: rgb(242, 242, 242);
  background-color: purple;
}

.formLabel {
  font-size: 1.2em;
}

.pre-text {
  position: absolute;
  left: 10px;
  top: 52px;
  color: grey;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: larger;
  z-index: 1;
}
</style>
