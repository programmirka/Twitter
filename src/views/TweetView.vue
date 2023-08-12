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
      :name="tweet.usr_name"
      :handle="tweet.usr_handle"
      :content="tweet.twt_content"
      :id="tweet.twt_id"
      :likes="tweet.twt_likes"
      :comments="tweet.twt_comments"
      :created="tweet.twt_created"
      :usr_id="tweet.usr_id"
    ></Tweet>

    <div class="commentSection">
      <img src="@/assets/profile.png" class="profilePic" />
      <textarea placeholder="Tweet your reply!" v-model="newComment"></textarea>
      <button class="replyBtn">Reply</button>
    </div>

    <div>
      <Comments
        v-for="comment in comments"
        :key="comment.com_id"
        :name="comment.usr_name"
        :handle="comment.usr_handle"
        :content="comment.com_content"
        :time="comment.com_created"
        :likes="comment.likes_number"
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
export default {
  data() {
    return {
      tweet: {},
      comments: [],
      newComment: "",
    };
  },
  props: {
    id: String,
  },
  components: {
    Tweet,
    Comments,
  },
  mounted() {
    console.log("Mounted");
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
          niz[i].twt_comments
        );
      }
      console.log("tweet" + JSON.stringify(this.tweet));
    }),
      CommentService.getComments(this.id).then((res) => {
        var niz = res.data.data;
        for (var i = 0; i < niz.length; i++) {
          this.comments.push(
            new CommentService.Comment(
              niz[i].com_id,
              niz[i].usr_name,
              niz[i].usr_handle,
              niz[i].twt_id,
              niz[i].com_content,
              niz[i].com_created,
              niz[i].com_deleted,
              niz[i].likes_number
            )
          );
        }
      });
  },
};
</script>
<style>
textarea {
  margin-top: 20px;
  width: 500px;
  height: 150px;
  resize: none;
  margin-right: 20px;
}
.replyBtn {
  border-radius: 20px;
  height: 50px;
  width: 80px;
  font-size: 18px;
  font-weight: 700;
  color: white;
  background-color: #6287ad;
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
