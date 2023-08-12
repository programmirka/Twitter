<template>
  <div class="mainTweet">
    <div class="profilePic">
      <img src="@/assets/profile.png" />
    </div>
    <div class="tweetContent">
      <p>
        <RouterLink
          v-if="usr_id"
          :to="{ name: 'profile-details', params: { id: usr_id } }"
          >{{ name }} | <span>@{{ handle }}</span> |</RouterLink
        >
        <span>{{ time }}</span>
      </p>
      <RouterLink :to="{ name: 'tweet-details', params: { id: id } }"
        ><p>{{ content }}</p></RouterLink
      >
      <div class="engagement">
        <div>
          <button>
            {{ comments }} <font-awesome-icon icon="fa-regular fa-comment" />
          </button>
        </div>
        <div>
          <button>
            {{ likes }} <font-awesome-icon icon="fa-regular fa-thumbs-up" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CreatedService from "@/services/CreatedService.js";
export default {
  props: {
    name: String,
    handle: String,
    content: String,
    id: Number,
    comments: Number,
    likes: Number,
    created: String,
    usr_id: String,
  },
  computed: {
    time() {
      return CreatedService.timeAgo(this.created);
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
