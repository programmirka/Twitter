<template>
  <div class="center">
    <h2>Who to follow</h2>
    <Follow
      v-if="follows.length"
      v-for="follow in follows"
      :key="follow.usr_id"
      :id="follow.usr_id"
      :name="follow.usr_name"
      :handle="follow.usr_handle"
      :profilePic="follow.usr_profilePic"
      @plsLoginModal="plsLoginModal"
    ></Follow>
    <div class="nofollow" v-else>
      <em>You are currently following all of the users</em>
    </div>
  </div>
</template>
<script>
import Follow from "@/components/Follow.vue";
import FollowService from "@/services/FollowService.js";
import LocalStorage from "../services/LocalStorage";
export default {
  components: {
    Follow,
  },
  data() {
    return {
      follows: [],
      followBtn: null, //TODO: dodaj gore
      id: null,
    };
  },
  beforeMount() {
    this.id = LocalStorage.id();
  },
  mounted() {
    FollowService.getFollows().then((res) => {
      var niz = res.data.data;
      for (var i = 0; i < niz.length; i++) {
        this.follows.push(
          new FollowService.Follow(
            niz[i].usr_id,
            niz[i].usr_name,
            niz[i].usr_handle,
            niz[i].usr_profilePic
          )
        );
      }
    });
  },
  methods: {
    plsLoginModal() {
      this.$emit("plsLoginModal");
    },
  },
};
</script>
<style scoped>
.center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.nofollow {
  width: 200px;
  margin: 100px auto;
  text-align: center;
  color: grey;
}
</style>
