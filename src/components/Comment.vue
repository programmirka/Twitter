<template>
  <div class="mainComment">
    <DeleteModal
      v-if="deleteComModal"
      @yes="deleteCommentConfirm"
      @no="deleteComModal = false"
      @close="deleteComModal = false"
    ></DeleteModal>
    <div class="profilePic">
      <img src="@/assets/profile.png" />
    </div>
    <div class="commentContent">
      <p>
        {{ comment.usr_name }} | <span>@{{ comment.usr_handle }}</span> |
        <span>{{ created }}</span>
      </p>
      <p v-if="!editCom">{{ comment.com_content }}</p>
      <div v-if="editCom" class="commentEdit">
        <textarea v-model="editedContent"></textarea>
        <div>
          <button class="cancelBtn" @click="editCom = false">Cancel</button
          ><br />
          <button class="replyBtn" @click="saveComment">Save</button>
        </div>
      </div>
      <div class="engagement">
        <div>
          <button
            v-if="authUser_id"
            @click="like"
            class="button"
            :class="{ likedBtn: comment.com_liked }"
          >
            {{ comment.likes_number }}
            <font-awesome-icon icon="fa-regular fa-thumbs-up" />
          </button>
          <button class="button" v-else>
            {{ comment.likes_number }}
            <font-awesome-icon icon="fa-regular fa-thumbs-up" />
          </button>
          <!-- TODO: bice f-ja koja navodi na login -->
        </div>
        <button
          v-if="comment.usr_id === authUser_id && !editCom"
          @click="deleteComment"
          class="delete"
        >
          Delete
        </button>
        <button
          v-if="comment.usr_id === authUser_id && !editCom"
          @click="editComment"
          class="edit"
        >
          Edit
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import CreatedService from "../services/CreatedService";
import LikeServices from "../services/LikeServices";
import LocalStorage from "../services/LocalStorage";
import DeleteModal from "./DeleteModal.vue";

export default {
  data() {
    return {
      editCom: false,
      deleteComModal: false,
      editedContent: "",
      editComObject: {
        com_id: this.comment.com_id,
        com_content: "",
      },
    };
  },
  props: {
    comment: Object,
    authUser_id: [String, Number],
  },
  methods: {
    like() {
      this.$emit("likeComment", this.comment.com_id);
    },
    deleteComment() {
      this.deleteComModal = true;
    },
    deleteCommentConfirm() {
      this.$emit("deleteComment", this.comment.com_id);
    },
    editComment() {
      this.editCom = true;
      this.editedContent = this.comment.com_content;
    },
    saveComment() {
      this.editComObject.com_content = this.editedContent;
      if (this.editComObject.com_content === this.comment.com_content) {
        this.editCom = false;
        return;
      }
      this.$emit("editComment", this.editComObject);
      this.editCom = false;
    },
  },
  computed: {
    created() {
      return CreatedService.timeAgo(this.comment.com_created);
    },
  },
  components: { DeleteModal },
};
</script>
<style scoped>
.mainComment {
  display: flex;
  align-items: start;
  justify-content: space-between;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.497);
  padding: 18px;
}
.profilePic {
  flex-basis: 2%;
}
.commentContent {
  flex-basis: 96%;
}
.profilePic img {
  height: 40px;
}
.commentContent p {
  margin-top: 0px;
}
.engagement {
  display: flex;
}
.engagement div {
  margin-right: 10px;
}
.button {
  min-width: 60px;
  height: 32px;
  background-color: aliceblue;
  border: 0.5px solid #6287ad;
}
.button:hover {
  background-color: #6287ad;
}
.likedBtn {
  background-color: #6287ad;
  color: white;
}
.delete,
.edit {
  margin-right: 10px;
  cursor: pointer;
  border: 1px solid rgba(128, 128, 128, 0.252);
  border-radius: 5px;
  width: 60px;
  padding: 6px;
  color: rgba(48, 48, 48, 0.787);
  background-color: rgba(164, 164, 164, 0.087);
}

.edit:hover {
  background-color: #6287ad;
  color: white;
}
.delete:hover {
  background-color: rgba(181, 46, 46, 0.45);
  color: white;
}
.commentEdit {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
}

.commentEdit textarea {
  font-family: "Montserrat", sans-serif;
  font-size: 1em;
  box-shadow: 10px 5px 5px grey;
  margin-top: 20px;
  width: 500px;
  height: 150px;
  resize: none;
  margin-right: 20px;
  border-radius: 15px;
  padding: 10px;
}
</style>
