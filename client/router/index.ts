import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import CommunityView from "../views/CommunityView.vue";
import CreateCommunityView from "../views/CreateCommunityView.vue";
import CreatePostView from "../views/CreatePostView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import SearchView from "../views/SearchView.vue";
import SettingView from "../views/SettingView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/community/:title",
      name: "Community",
      component: CommunityView,
      meta: { requiresAuth: false },
      props: true,
    },
    {
      path: "/create/community",
      name: "Create Community",
      component: CreateCommunityView,
      meta: { requiresAuth: true },
    },
    {
      path: "/create/post",
      name: "Create Post",
      component: CreatePostView,
      meta: { requiresAuth: true },
    },
    {
      path: "/search",
      name: "Search",
      component: SearchView,
      meta: { requiresAuth: false },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
