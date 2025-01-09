<template>
  <DeleteModal
    v-if="deleteTweetModal"
    @close="deleteTweetModal = false"
    @yes="deleteTweetConfirm"
    @no="deleteTweetModal = false"
  ></DeleteModal>
  <div class="largeTweet">
    <div class="mainTweet">
      <div class="profilePicTwt">
        <img
          :src="
            'http://localhost:5173/backend/server/images/' + profileImagePath
          "
        />
      </div>
      <div class="tweetContent">
        <p>
          <!-- ne znam zasto ali imala sam v-if="usr_id" -->
          <RouterLink :to="{ name: 'profile-details', params: { id: usr_id } }"
            >{{ usr_name }} | <span>@{{ handle }}</span> |
          </RouterLink>
          <span class="mainColor"> {{ time }}</span>
        </p>
        <RouterLink
          v-if="!editTwt"
          :to="{ name: 'tweet-details', params: { id: id } }"
          ><p class="content">{{ content }}</p></RouterLink
        >
        <div v-if="editTwt" class="tweetEdit">
          <textarea class="mainColor" v-model="editedContent"></textarea>
          <div>
            <button class="cancelBtn" @click="editTwt = false">Cancel</button
            ><br />
            <button class="replyBtn" @click="saveTweet">Save</button>
          </div>
        </div>
        <div class="engagement">
          <div v-if="authUser_id">
            <RouterLink :to="{ name: 'tweet-details', params: { id: id } }">
              <button class="button">
                {{ comments }}
                <font-awesome-icon icon="fa-regular fa-comment" />
              </button>
            </RouterLink>
          </div>
          <div v-else>
            <button @click="plsLoginModal" class="button">
              {{ comments }}
              <font-awesome-icon icon="fa-regular fa-comment" />
            </button>
          </div>

          <div>
            <button
              v-if="authUser_id"
              @click="like"
              class="button"
              :class="{ likedBtn: liked }"
            >
              {{ likes }}
              <font-awesome-icon icon="fa-regular fa-thumbs-up" />
            </button>
            <button
              v-else
              @click="plsLoginModal"
              class="button"
              :class="{ likedBtn: liked }"
            >
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
    <div>
      <button
        v-if="admin && adminId !== usr_id"
        class="adminDeleteBtn"
        @click="deleteTweet"
      >
        Delete
      </button>
    </div>
  </div>
</template>
<script>
import CreatedService from "@/services/CreatedService.js";
import LikeServices from "@/services/LikeServices.js";
import LocalStorage from "../services/LocalStorage";
import DeleteModal from "../components/DeleteModal.vue";

export default {
  emits: [
    "likeTweet",
    "dislikeTweet",
    "deleteTweet",
    "editTweet",
    "plsLoginModal",
  ],
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
    profileImagePath: String,
  },
  created() {
    console.log("this.liked", this.liked);
  },
  data() {
    return {
      admin: LocalStorage.admin(),
      adminId: LocalStorage.adminId(),
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
    plsLoginModal() {
      this.$emit("plsLoginModal");
    },
  }, //ovde samo jos likedState da resim
};
</script>
<style>
.mainTweet {
  position: relative;
  padding: 5px 0px 10px;
  padding: 18px;
}
.largeTweet {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(128, 128, 128, 0.497);
}
.profilePicTwt {
  left: 15px;
  position: absolute;
  width: 55px;
  height: 55px;
  overflow: hidden;
  border-radius: 50%;
}
.tweetContent {
  margin-left: 63px;
}
.tweetContent a:first-child:hover {
  color: #6287ad;
}
.profilePicTwt img {
  width: 55px;
  position: absolute;
  top: 0%;
  left: 0%;
}

.tweetContent p {
  margin-top: 0px;
}
.tweetContent > p {
  margin-bottom: 5px;
}
.engagement {
  display: flex;
  align-items: center;
}
.engagement div {
  margin-right: 0px;
}

.button {
  min-width: 60px;
  height: 32px;
  background-color: aliceblue;
  border: 0.5px solid #6287ad;
  border-radius: 10px;
  margin-right: 5px;
}
.button:hover {
  background-color: #6287ad;
  color: #fff;
  cursor: pointer;
}

.likedBtn {
  background-color: #6287ad;
  color: white;
}
.delete,
.edit {
  margin-right: 5px;
  cursor: pointer;
  border: 1px solid rgba(128, 128, 128, 0.088);
  border-radius: 5px;
  width: 55px;
  height: 30px;
  padding: 3px 8px;
  color: rgba(48, 48, 48, 0.532);
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
.tweetEdit {
  font-size: 1.1em;
}
</style>
