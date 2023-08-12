import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/explore",
      name: "explore",
      component: () => import("../views/ExploreView.vue"),
    },

    {
      path: "/tweet/:id",
      name: "tweet-details",
      props: true,
      component: () => import("../views/TweetView.vue"),
    },
    {
      path: "/profile/:id",
      name: "profile-details",
      props: true,
      component: () => import("../views/ProfileView.vue"),
    },
  ],
});

export default router;
