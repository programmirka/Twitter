<template>
  <DeleteModal
    v-if="deleteTweetModal"
    @close="deleteTweetModal = false"
    @yes="deleteTweetConfirm"
    @no="deleteTweetModal = false"
  ></DeleteModal>
  <div class="mainTweet">
    <div class="profilePic">
      <img src="@/assets/profile.png" />
    </div>
    <div class="tweetContent">
      <p>
        <!-- ne znam zasto ali imala sam v-if="usr_id" -->
        <RouterLink :to="{ name: 'profile-details', params: { id: usr_id } }"
          >{{ usr_name }} | <span>@{{ handle }}</span> |</RouterLink
        >
        <span>{{ time }}</span>
      </p>
      <RouterLink
        v-if="!editTwt"
        :to="{ name: 'tweet-details', params: { id: id } }"
        ><p>{{ content }}</p></RouterLink
      >
      <div v-if="editTwt" class="tweetEdit">
        <textarea v-model="editedContent"></textarea>
        <div>
          <button class="cancelBtn" @click="editTwt = false">Cancel</button
          ><br />
          <button class="replyBtn" @click="saveTweet">Save</button>
        </div>
      </div>
      <div class="engagement">
        <div>
          <RouterLink :to="{ name: 'tweet-details', params: { id: id } }">
            <button class="button">
              {{ comments }} <font-awesome-icon icon="fa-regular fa-comment" />
            </button>
          </RouterLink>
        </div>
        <div>
          <button @click="like" class="button" :class="{ likedBtn: liked }">
            {{ likes }}
            <font-awesome-icon icon="fa-regular fa-thumbs-up" />
          </button>
        </div>
        <button
          v-if="usr_id === authUser_id"
          @click="deleteTweet"
          class="delete"
        >
          Delete
        </button>
        <button v-if="usr_id === authUser_id" @click="editTweet" class="edit">
          Edit
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import CreatedService from "@/services/CreatedService.js";
import LikeServices from "@/services/LikeServices.js";
import LocalStorage from "../services/LocalStorage";
import DeleteModal from "../components/DeleteModal.vue";

export default {
  emits: ["likeTweet", "dislikeTweet", "deleteTweet", "editTweet"],
  components: {
    DeleteModal,
  },
  props: {
    usr_name: String,
    handle: String,
    content: String,
    id: Number, //tweet id
    comments: Number,
    created: String,
    usr_id: String,
    likes: Number,
    liked: Boolean,
  },
  created() {
    console.log("this.liked", this.liked);
  },
  data() {
    return {
      likeObj: {
        twt_id: this.id,
        usr_id: LocalStorage.id(),
      },
      authUser_id: LocalStorage.id(),
      deleteTweetModal: false,
      editTwt: false,
      editedContent: "",
      editTwtObj: {
        twt_id: null,
        twt_content: "",
      },
    };
  },
  computed: {
    time() {
      return CreatedService.timeAgo(this.created);
    },
  },
  methods: {
    like() {
      if (this.likeObj.usr_id) {
        this.likeObj.twt_id = this.id;
        LikeServices.likeTweet(this.likeObj)
          .then((res) => {
            if (res.data.data === "like") {
              this.$emit("likeTweet", this.id);
            } else {
              this.$emit("dislikeTweet", this.id);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        alert("Please login");
      }
    },
    deleteTweet() {
      this.deleteTweetModal = true;
    },
    deleteTweetConfirm() {
      this.$emit("deleteTweet", this.id);
    },
    editTweet() {
      this.editTwt = true;
      this.editedContent = this.content;
    },
    saveTweet() {
      console.log("u save tweet twt id", this.editTwtObj.twt_id);
      this.editTwtObj.twt_content = this.editedContent;
      this.editTwtObj.twt_id = this.id;
      if (this.editTwtObj.twt_content === this.content) {
        this.editTwt = false;
        return;
      }
      this.$emit("editTweet", this.editTwtObj);
      this.editTwt = false;
    },
  }, //ovde samo jos likedState da resim
};
</script>
<style>
.mainTweet {
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
.tweetContent {
  flex-basis: 96%;
}
.profilePic img {
  height: 40px;
}
.tweetContent p {
  margin-top: 0px;
}
.engagement {
  display: flex;
}
.engagement div {
  margin-right: 0px;
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
.delete {
  margin-left: 10px;
}

.edit:hover {
  background-color: #6287ad;
  color: white;
}
.delete:hover {
  background-color: rgba(181, 46, 46, 0.45);
  color: white;
}
</style>
