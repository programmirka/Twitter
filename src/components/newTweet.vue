<template>
  <div class="commentSection">
    <img src="@/assets/profile.png" class="profilePic" />
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
  methods: {
    publish() {
      this.$emit("publishTweet", { twt_content: this.newTweet });
      this.newTweet = "";
    },
  },
};
</script>
<style scoped>
/* the same as in tweetView for reply */
textarea {
  margin-top: 20px;
  width: 600px;
  height: 150px;
  resize: none;
  margin-right: 20px;
  border-radius: 15px;
  padding: 10px;
}
.replyBtn {
  border-radius: 20px;
  height: 50px;
  width: 80px;
  font-size: 18px;
  font-weight: 700;
  color: white;
  background-color: #6287ad;
  cursor: pointer;
}
.replyBtn:hover {
  height: 55px;
  width: 85px;
}

.profilePic {
  height: 70px;
  margin-right: 20px;
}
.commentSection {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #9a9a9a;
  padding-bottom: 20px;
}
.commentSection textarea {
  font-family: "Montserrat", sans-serif;
  font-size: 1em;
}
.disabledButton {
  background-color: #cacaca5e;
  color: rgba(96, 96, 96, 0.566);
  cursor: auto;
}
.disabledButton:hover {
  height: 50px;
  width: 80px;
}
</style>
