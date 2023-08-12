<template>
  <div class="modal" v-show="editProfileModVis && id">
    <div class="editProfile">
      <div class="editProfileTitle">
        <button @click="closeModal">X</button>
        <!-- emitovacu closeModal parent-u sto je ProfileView-->
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
        <BaseInput
          v-model="user.handle"
          label="Handle"
          type="text"
          :error="errors.handle"
        ></BaseInput>
        <BaseTextarea
          v-model="user.about"
          label="About"
          type="text"
          :error="errors.about"
        >
        </BaseTextarea>
        <legend class="birthday">Birthday</legend>
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
        ></BaseSelect
        ><br />

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

        <button class="submit" type="submit">Sumbit</button>
      </form>
    </div>
  </div>
</template>
<script>
import CreatedService from "@/services/CreatedService.js";
import EditProfileService from "@/services/EditProfileService.js";
import LocalStorage from "../services/LocalStorage";
import Validation from "../services/Validation.js";

export default {
  props: {
    editProfileModVis: Boolean, //treba da imamo u ProfilView na dugme edit da se lokalni data boolean za editProfileModalVisibility
  },
  //polja nece biti prazna vec cu odmah u mountu za ovog user-a da ucitam trenutne podatke u input
  data() {
    return {
      id: String,
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
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
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
  },
  beforeMount() {
    this.id = LocalStorage.id();
  },
  mounted() {
    if (this.id) {
      console.log(this.id);
      EditProfileService.openEditProfile(this.id)
        .then((res) => {
          let userDB = EditProfileService.openEditProfileSuccess(res);
          this.user.name = userDB.usr_name;
          this.user.email = userDB.usr_email;
          this.user.handle = userDB.usr_handle;
          this.user.about = userDB.usr_about;
          this.user.birth.day = CreatedService.day(userDB.usr_birth);
          this.user.birth.month = CreatedService.month(userDB.usr_birth);
          this.user.birth.year = CreatedService.year(userDB.usr_birth);

          console.log(userDB.usr_birth);
        })
        .catch((err) => {
          console.error(err);
        });
    }
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
  },
};
</script>
<style scoped>
.modal {
  position: absolute;
  z-index: 3000;
  top: 0px;
  left: 0px;
  width: 100%;
  /* height: 100%; */
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 50px;
}
.editProfile {
  width: 800px;
  height: 1000px;
  background-color: aliceblue;
  padding: 8px 70px;
  margin-top: 50px;
  position: relative;
}
.editProfileTitle {
  display: flex;
}
.editProfileTitle h1 {
  margin: 0px;
}
.editProfileTitle button {
  background-color: #b6bdc4;
  padding: 15px 20px;
  border: none;
  font-size: 23px;
  border-radius: 10px;
  position: absolute;
  top: 0px;
  left: 0;
  border-radius: 0px;
}
.editProfileTitle button:hover {
  background-color: #b5391678;
}
.editProfileTitle button:active {
  background-color: #b53916cd;
}
.submit {
  background-color: #b6bdc4;
  padding: 15px 20px;
  border: none;
  font-size: 23px;
  border-radius: 10px;
}
.submit:hover {
  background-color: #6287ad;
}
.submit:active {
  background-color: #397dc1;
}
</style>
