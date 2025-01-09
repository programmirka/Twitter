<template>
  <div class="commentSection">
    <div class="image-container">
      <img
        :src="'http://localhost:5173/backend/server/images/' + profileImagePath"
        class="profile-image"
      />
    </div>
    <textarea placeholder="Make a new Tweet!" v-model="newTweet"></textarea>
    <button
      class="replyBtn"
      :disabled="!newTweet.length"
      @click="publish"
      :class="{ disabledButton: !newTweet.length }"
    >
      Publish
    </button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      newTweet: "",
    };
  },
  props: ["profileImagePath"],
  methods: {
    publish() {
      this.$emit("publishTweet", { twt_content: this.newTweet });
      this.newTweet = "";
    },
  },
};
</script>
<style scoped>
.commentSection {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #9a9a9a;
  padding: 10px 20px 20px;
  position: relative;
}
textarea {
  width: 600px;
  height: 90px;
  resize: none;
  margin-right: 10px;
  margin-left: 90px;
  border-radius: 15px;
  padding: 10px;
  background-color: #9a9a9a13;
  font-family: "Montserrat", sans-serif;
  font-size: 1em;
  border: 0.5px solid rgba(128, 128, 128, 0.335);
}

.disabledButton {
  background-color: #cacaca5e;
  color: rgba(96, 96, 96, 0.566);
  border: grey solid 0.5px;
  cursor: no-drop;
}
.disabledButton:hover {
  height: 40px;
  width: 80px;
}

.image-container {
  left: 15px;
  position: absolute;
  width: 85px;
  height: 85px;
  overflow: hidden;
  border-radius: 50%;
}
.profile-image {
  width: 85px;
  position: absolute;
  top: 0%;
  left: 0%;
}
</style>
