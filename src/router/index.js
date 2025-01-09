import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Explore from "@/views/ExploreView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/home",
      name: "home",
      props: (route) => ({ page: parseInt(route.query.page) || 1 }),
      component: HomeView,
    },
    {
      path: "/",
      name: "explore",
      props: (route) => ({ page: parseInt(route.query.page) || 1 }),
      component: Explore,
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
      props: (route) => ({
        page: parseInt(route.query.page) || 1,
        id: route.params.id,
      }),
      component: () => import("../views/ProfileView.vue"),
    },
    {
      path: "/search/:tag?",
      name: "search",
      props: (route) => ({
        page: parseInt(route.query.page) || 1,
        tag: route.params.tag,
      }),
      component: () => import("../views/SearchView.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/AdminView.vue"),
    },
  ],
});

export default router;
