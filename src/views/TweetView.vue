<template>
  <div>
    <div class="back">
      <RouterLink to="/">
        <font-awesome-icon
          icon="fa-regular fa-arrow-alt-circle-left"
          size="2xl"
          style="color: #34495e"
        />
      </RouterLink>
      <h2>Tweet</h2>
    </div>

    <Tweet
      @likeTweet="likeTweet"
      @dislikeTweet="dislikeTweet"
      :usr_name="tweet.usr_name"
      :handle="tweet.usr_handle"
      :content="tweet.twt_content"
      :id="tweet.twt_id"
      :comments="tweet.twt_comments"
      :created="tweet.twt_created"
      :usr_id="tweet.usr_id"
      :likes="tweet.twt_likes"
      :liked="tweet.twt_liked"
      :profileImagePath="tweet.usr_profilePic"
      @deleteTweet="deleteTweet"
      @editTweet="editTweet"
      @plsLoginModal="plsLoginModal = true"
    ></Tweet>

    <div v-if="authUser_id" class="replySection">
      <div class="profilePicRply">
        <img
          :src="
            'http://localhost:5173/backend/server/images/' + commentProfileImage
          "
          class="profilePic"
        />
      </div>
      <textarea placeholder="Tweet your reply!" v-model="newComment"></textarea>
      <button class="replyBtn" @click="comment">Reply</button>
    </div>

    <div class="commentsDiv">
      <Comments
        v-for="comment in comments"
        :key="comment.com_id"
        :comment="comment"
        @likeComment="likeComment"
        @deleteComment="deleteComment"
        @editComment="editComment"
        :authUser_id="authUser_id"
        @plsLoginModal="plsLoginModal = true"
      ></Comments>
    </div>
    <div class="noComment" v-if="!comments.length && authUser_id">
      <p><em>No comments yet. Be the first to comment!</em></p>
    </div>
    <PleaseLoginModal
      v-if="plsLoginModal"
      @close="plsLoginModal = false"
    ></PleaseLoginModal>
  </div>
</template>
<script>
import Tweet from "@/components/Tweet.vue";
import TweetService from "../services/TweetService";
import Comments from "@/components/Comment.vue";
import CommentService from "../services/CommentService";
import LocalStorage from "../services/LocalStorage";
import ProfileService from "../services/ProfileService";
import LikeServices from "../services/LikeServices";
import PleaseLoginModal from "@/components/PleaseLoginModal.vue";

export default {
  data() {
    return {
      tweet: {},
      comments: [],
      newComment: "",
      commentObj: {
        twt_id: null,
        com_content: this.newComment,
        usr_id: LocalStorage.id(),
      },
      authUser_id: null,
      plsLoginModal: false,
      commentProfileImage: null,
      // TODO: DODAJ
    };
  },
  props: {
    id: String,
  },
  components: {
    Tweet,
    Comments,
    PleaseLoginModal,
  },
  methods: {
    getComments() {
      CommentService.getComments(this.id).then((res) => {
        var niz = res.data.data;
        if (niz) {
          for (var i = 0; i < niz.length; i++) {
            this.comments.push(
              new CommentService.Comment(
                niz[i].com_id,
                niz[i].usr_name,
                niz[i].usr_id,
                niz[i].usr_handle,
                niz[i].twt_id,
                niz[i].com_content,
                niz[i].com_created,
                niz[i].com_deleted,
                niz[i].likes_number,
                niz[i].com_liked,
                niz[i].usr_profilePic
              )
            );
          }
        }
      });
    },
    getTweet() {
      TweetService.getTweet(this.id).then((res) => {
        var niz = res.data.data;
        for (var i = 0; i < niz.length; i++) {
          this.tweet = new TweetService.Tweet(
            niz[i].twt_id,
            niz[i].usr_id,
            niz[i].twt_content,
            niz[i].twt_created,
            niz[i].twt_deleted,
            niz[i].usr_name,
            niz[i].usr_handle,
            niz[i].twt_likes,
            niz[i].twt_comments,
            niz[i].twt_liked,
            niz[i].usr_profilePic
          );
        }
        this.commentObj.twt_id = this.tweet.twt_id;
      });
    },
    comment() {
      CommentService.addComment(this.commentObj)
        .then((res) => {
          console.log(res.data.data);
          this.comments = [];
          this.newComment = "";
          this.tweet.twt_comments++;
          return this.getComments();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    likeTweet() {
      this.tweet.twt_likes++;
      this.tweet.twt_liked = true;
    },
    dislikeTweet() {
      this.tweet.twt_likes--;
      this.tweet.twt_liked = false;
    },
    likeComment(com_id) {
      console.log("u like comment", {
        com_id: com_id,
        usr_id: this.authUser_id,
      });
      LikeServices.likeComment({ com_id: com_id, usr_id: this.authUser_id })
        .then((res) => {
          if (res.data.data === "like") {
            for (var i = 0; i < this.comments.length; i++) {
              if (this.comments[i].com_id === com_id) {
                this.comments[i].likes_number++;
                this.comments[i].com_liked = true; //TODO: dodaj com_liked u stvaranje
              }
            }
          } else {
            for (var i = 0; i < this.comments.length; i++) {
              if (this.comments[i].com_id === com_id) {
                this.comments[i].likes_number--;
                this.comments[i].com_liked = false; //TODO: dodaj com_liked u stvaranje
              }
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    deleteComment(com_id) {
      CommentService.deleteComment(com_id)
        .then((res) => {
          this.comments = [];
          this.getComments();
          this.tweet.twt_comments--;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    editComment(object) {
      CommentService.editComment(object)
        .then((res) => {
          this.comments = [];
          this.getComments();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    deleteTweet(twt_id) {
      TweetService.deleteTweet(twt_id)
        .then((res) => {
          this.$router.push("/");
        })
        .catch((err) => {
          console.error(err);
        });
    },
    editTweet(object) {
      TweetService.editTweet(object)
        .then((res) => {
          this.tweet = {};
          this.getTweet();
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  mounted() {
    this.getTweet();
    this.getComments();
    this.authUser_id = LocalStorage.id();
    ProfileService.getUser(this.authUser_id)
      .then((res) => {
        this.commentProfileImage = res.data.data.usr_profilePic;
      })
      .catch((e) => {
        console.error("An error occurred:", e);
      });
    console.log("user_id", this.authUser_id);
  },
  watch: {
    newComment(newVal, oldVal) {
      if (newVal) {
        this.commentObj.com_content = newVal;
      }
    },
  },
};
</script>
<style>
.replySection textarea {
  width: 500px;
  height: 80px;
  resize: none;
  margin-right: 20px;
  border-radius: 15px;
  padding: 10px;
  background-color: #9a9a9a13;
  font-family: "Montserrat", sans-serif;
  font-size: 1em;
  border: 0.5px solid rgba(128, 128, 128, 0.335);
}

.profilePicRply {
  position: relative;
  width: 70px;
  height: 70px;
  overflow: hidden;
  border-radius: 50%;
  margin-right: 15px;
}

.profilePic {
  width: 70px;
  position: absolute;
  top: 0%;
  left: 0%;
}
.replySection {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #9a9a9a;
  padding: 20px 20px 20px 100px;
}

.back {
  display: flex;
  padding-top: 10px;
  align-items: left;
  justify-content: left;
  flex-direction: column;
}

.back h2 {
  font-weight: 200;
  font-size: 1.4em;
  margin-left: 5px;
  color: rgb(153, 153, 153);
}
.noComment {
  margin-left: 270px;
  color: #34495e;
  padding-top: 5px;
  font-size: 1.1em;
}
</style>
