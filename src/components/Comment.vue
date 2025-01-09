<template>
  <div class="largeComment">
    <div class="mainComment">
      <DeleteModal
        v-if="deleteComModal"
        @yes="deleteCommentConfirm"
        @no="deleteComModal = false"
        @close="deleteComModal = false"
      ></DeleteModal>
      <div class="profilePicCom">
        <img
          :src="
            'http://localhost:5173/backend/server/images/' +
            comment.usr_profilePic
          "
        />
      </div>
      <div class="commentContent">
        <p class="mainColor">
          {{ comment.usr_name }} | <span>@{{ comment.usr_handle }}</span> |
          <span>{{ created }}</span>
        </p>
        <p class="mainColor content" v-if="!editCom">
          {{ comment.com_content }}
        </p>
        <div v-if="editCom" class="commentEdit">
          <textarea class="mainColor" v-model="editedContent"></textarea>
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
            <button @click="plsLoginModal" class="button" v-else>
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
    <div>
      <button
        v-if="admin && adminId !== comment.usr_id"
        @click="deleteComment"
        class="adminDeleteBtn"
      >
        Delete
      </button>
    </div>
  </div>
</template>
<script scoped>
import CreatedService from "../services/CreatedService";
import LikeServices from "../services/LikeServices";
import LocalStorage from "../services/LocalStorage";
import DeleteModal from "./DeleteModal.vue";

export default {
  data() {
    return {
      admin: LocalStorage.admin(),
      adminId: LocalStorage.adminId(),

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
    plsLoginModal() {
      this.$emit("plsLoginModal");
    },
  },
  computed: {
    created() {
      return CreatedService.timeAgo(this.comment.com_created);
    },
  },
  components: { DeleteModal },
  mounted() {
    console.log(this.comment);
  },
};
</script>
<style>
.largeComment {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(128, 128, 128, 0.497);
  padding-left: 10px;
  padding-top: 10px;
}
.mainComment {
  display: flex;
  align-items: start;
  justify-content: space-between;

  padding: 5px 0px 10px;
  position: relative;
}
.profilePicCom {
  position: absolute;
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 50%;
}
.commentContent {
  margin-left: 60px;
}
.profilePicCom img {
  width: 50px;
  position: absolute;
  top: 0%;
  left: 0%;
}

.commentContent p {
  margin-top: 0px;
}
.commentContent p:first-of-type {
  margin-bottom: 5px;
}
.content {
  margin-bottom: 16px;
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

.commentEdit {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  font-size: 1.1em;
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
