<template>
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
      <RouterLink :to="{ name: 'tweet-details', params: { id: id } }"
        ><p>{{ content }}</p></RouterLink
      >
      <div class="engagement">
        <div>
          <RouterLink :to="{ name: 'tweet-details', params: { id: id } }">
            <button>
              {{ comments }} <font-awesome-icon icon="fa-regular fa-comment" />
            </button>
          </RouterLink>
        </div>
        <div>
          <button @click="like">
            {{ likeBtn }} <font-awesome-icon icon="fa-regular fa-thumbs-up" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CreatedService from "@/services/CreatedService.js";
import LikeServices from "@/services/LikeServices.js";

export default {
  props: {
    usr_name: String,
    handle: String,
    content: String,
    id: Number, //tweet id
    comments: Number,
    likes: Number,
    created: String,
    usr_id: String,
  },
  data() {
    return {
      likeObj: {
        twt_id: this.id,
        usr_id: this.usr_id,
      },
      likeBtn: this.likes,
    };
  },
  computed: {
    time() {
      return CreatedService.timeAgo(this.created);
    },
  },
  methods: {
    like() {
      LikeServices.like(this.likeObj)
        .then((res) => {
          if (res.data.data === "like") {
            this.likeBtn++;
          } else {
            this.likeBtn--;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>
<style scoped>
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
  margin-right: 10px;
}
</style>
