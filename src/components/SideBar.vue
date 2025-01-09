<template>
  <nav class="main-nav">
    <RouterLink :to="{ name: 'home' }" v-if="loggedUserNav">
      <font-awesome-icon :icon="['fas', 'home']" /> Home</RouterLink
    >
    <RouterLink :to="{ name: 'explore' }"
      ><font-awesome-icon :icon="['far', 'compass']" /> Explore</RouterLink
    >
    <RouterLink
      :to="{ name: 'profile-details', params: { id: id } }"
      v-if="loggedUserNav && id"
      ><font-awesome-icon :icon="['far', 'user']" /> Profile
    </RouterLink>
    <RouterLink :to="{ name: 'search' }" v-if="loggedUserNav">
      <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
      Search</RouterLink
    >
    <RouterLink to="/admin" v-if="loggedUserNav && userAdmin">
      <font-awesome-icon :icon="['fas', 'gear']" /> Admin</RouterLink
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
      userAdmin: Boolean,
    };
  },
  beforeUpdate() {
    this.id = LocalStorage.id();
    console.log(LocalStorage.id());
    this.userAdmin = LocalStorage.admin();
  },
};
console.log(LocalStorage.id());
</script>
<style scooped></style>
