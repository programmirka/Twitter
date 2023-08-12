<template>
  <nav class="main-nav">
    <RouterLink to="/" v-if="loggedUserNav">Home</RouterLink>
    <RouterLink to="/explore">Explore</RouterLink>
    <RouterLink
      :to="{ name: 'profile-details', params: { id: id } }"
      v-if="loggedUserNav && id"
      >Profile</RouterLink
    >
  </nav>
</template>
<script>
import LocalStorage from "../services/LocalStorage";
export default {
  props: {
    loggedUserNav: Boolean,
    //ovde cemo definisati id, koji ce se potom kao prop ucitavati na Profile View componenti
  },
  data() {
    return {
      id: null,
    };
  },
  mounted() {
    this.id = LocalStorage.id;
  },
};
</script>
<style scooped></style>
