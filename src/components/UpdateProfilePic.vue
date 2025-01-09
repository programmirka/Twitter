<template>
  <div class="modal">
    <div class="updateProfilePicDiv">
      <span @click="closeModal" class="close">&times</span>
      <h3 v-if="!uploaded">Current profile picture</h3>
      <img
        v-if="!uploaded"
        :src="'http://localhost:5173/backend/server/images/' + profileImagePath"
      />
      <form class="profilePicChange" @submit.prevent="uploadProfileImage">
        <label v-if="!uploaded" class="custom-file-upload">
          <input type="file" @change="handleFileUpload" />
          Choose picture </label
        ><br />
        <p v-if="uploaded">
          Picture is uploaded and will be updated after save!
          <br /><span
            ><font-awesome-icon :icon="['fas', 'arrow-down-long']"
          /></span>
        </p>

        <button type="submit" class="save-button" :disabled="!selectedFile">
          Save
        </button>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectedFile: "",
    };
  },
  props: {
    profileImagePath: String,
    uploaded: Boolean,
  },
  methods: {
    handleFileUpload(e) {
      this.selectedFile = e.target.files[0];
      this.$emit("handleFileUpload", e);
    },
    uploadProfileImage() {
      this.$emit("uploadProfilePic");
    },
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped>
.updateProfilePicDiv {
  width: 30%;
  background-color: #fff;
  padding: 20px 5px;
  margin-top: 50px;
  position: relative;
  text-align: center;
  border-radius: 15px;
  box-shadow: -3px 5px 12px -1px rgba(0, 0, 0, 0.559);
}
.updateProfilePicDiv img {
  width: 40%;
  border: 4px double grey;
}
.updateProfilePicDiv h3 {
  font-size: 1.05em;
}

.save-button {
  width: 7rem;
  padding: 0.5rem;
  background-color: #278be9;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 1rem;
}
/* .profilePicChange input {
  font-size: 0.9rem;
  padding: 20px;
} */

input[type="file"] {
  display: none;
}
.custom-file-upload {
  margin: 20px 0 20px;
  border: 1px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  background-color: #278be9;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 1rem;
}

.save-button:disabled {
  background-color: #b3bcc4;
  cursor: no-drop;
}
.progess-bar {
  height: 20px;
  background-color: #278be9;
}
.profilePicChange p {
  margin-top: 0;
}
</style>
