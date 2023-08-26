<template>
  <div>
    <div class="back">
      <RouterLink to="/explore">
        <button @click="back">
          <!--  za sada nema nista za back, 
          ali moracu svakako nesto da smislim kako da mi se na back vraca na bilo koji od profile/explore.home 
          u zavisnosti odakle je user usao -->
          <font-awesome-icon
            icon="fa-regular fa-arrow-alt-circle-left"
            size="2xl"
            style="color: #34495e"
          />
        </button>
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
      @deleteTweet="deleteTweet"
      @editTweet="editTweet"
    ></Tweet>

    <div class="commentSection">
      <img src="@/assets/profile.png" class="profilePic" />
      <textarea placeholder="Tweet your reply!" v-model="newComment"></textarea>
      <button class="replyBtn" @click="comment">Reply</button>
    </div>

    <div>
      <Comments
        v-for="comment in comments"
        :key="comment.com_id"
        :comment="comment"
        @likeComment="likeComment"
        @deleteComment="deleteComment"
        @editComment="editComment"
        :authUser_id="authUser_id"
      ></Comments>
    </div>
    <div v-if="!comments.length">
      <p><em>No comments yet. Be the first to comment!</em></p>
    </div>
  </div>
</template>
<script>
import Tweet from "@/components/Tweet.vue";
import TweetService from "../services/TweetService";
import Comments from "@/components/Comment.vue";
import CommentService from "../services/CommentService";
import LocalStorage from "../services/LocalStorage";
import LikeServices from "../services/LikeServices";

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
    };
  },
  props: {
    id: String,
  },
  components: {
    Tweet,
    Comments,
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
                niz[i].com_liked
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
            niz[i].twt_liked
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
.commentSection textarea {
  margin-top: 20px;
  width: 500px;
  height: 150px;
  resize: none;
  margin-right: 20px;
  border-radius: 15px;
  padding: 10px;
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
.back {
  display: flex;
}
.back button {
  border: none;
  background-color: #ffffff00;
}
.back h2 {
  font-weight: 400;
}
</style>
