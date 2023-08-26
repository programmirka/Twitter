<template>
  <nav class="main-nav">
    <RouterLink to="/" v-if="loggedUserNav">Home</RouterLink>
    <RouterLink to="/explore">Explore</RouterLink>
    <RouterLink
      :to="{ name: 'profile-details', params: { id: id } }"
      v-if="loggedUserNav && id"
      >Profile</RouterLink
    >
    <RouterLink
      :to="{ name: 'search', params: { tag: id } }"
      v-if="loggedUserNav"
    >
      <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
      Search</RouterLink
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
  beforeUpdate() {
    this.id = LocalStorage.id();
    console.log(LocalStorage.id());
  },
};
console.log(LocalStorage.id());
</script>
<style scooped></style>
