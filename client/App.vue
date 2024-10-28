<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());
const { currentUsername } = storeToRefs(userStore);
const communities = ref<Array<Record<string, string>>>([]);

const getUserCommunities = async (username: string) => {
  let response;
  try {
    response = await fetchy(`/api/users/${username}/communities`, "GET");
  } catch (_) {
    console.log(_);
    return;
  }

  communities.value = response;
};

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }

  try {
    await getUserCommunities(currentUsername.value);
  } catch {
    //
  }
});
</script>

<template>
  <div class="container">
    <div class="navbar">
      <div class="title">
        <img class="logo" src="@/assets/images/book.svg" />
        <RouterLink :to="{ name: 'Home' }">
          <h1>artBook</h1>
        </RouterLink>
      </div>
      <ul class="options">
        <li>
          <img src="@/assets/images/home.svg" />
          <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }"> Home </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <img src="@/assets/images/settings.svg" />
          <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }"> Settings </RouterLink>
        </li>
        <li v-else>
          <img src="@/assets/images/settings.svg" />
          <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }"> Login </RouterLink>
        </li>
        <li>
          <img src="@/assets/images/search.svg" />
          <RouterLink :to="'/search/'" :class="{ underline: currentRouteName == 'Search' }"> Search Communities </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <img src="@/assets/images/submit.svg" />
          <RouterLink :to="'/create/post/'" :class="{ underline: currentRouteName == 'Create Post' }"> Submit Post </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <img src="@/assets/images/create.svg" />
          <RouterLink :to="'/create/community/'" :class="{ underline: currentRouteName == 'Create Community' }"> Create Community </RouterLink>
        </li>
        <hr v-if="isLoggedIn" />
        <li class="comms" v-if="isLoggedIn">Your Communities</li>
        <li v-if="isLoggedIn">
          <ul class="community">
            <li v-for="(c, i) in communities" :key="i">
              <RouterLink :to="{ name: 'Community', params: { title: c.title } }" :class="{ underline: currentRouteName == 'Community' }">{{ c.title }}</RouterLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="page">
      <RouterView :key="$route.fullPath" />
    </div>
  </div>
</template>

<style scoped>
@import "./assets/toast.css";

@font-face {
  font-family: HeyComic;
  src: url("@/assets/HeyComic.otf");
  src: url("./assets/font/HeyComic.ttf") format("truetype");
}

.comms {
  font-size: 1.3em;
  font-weight: bold;
}

.container {
  display: flex;
}

.page {
  flex-grow: 1;
  margin: 0 0 0 300px;
  overflow-x: hidden;
  background-color: #dcedff;
  min-height: 100vh;
}

h1 {
  font-size: 2em;
  margin: 0;
  font-family: HeyComic;
  color: #343f3e;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding-left: 20px;
  padding-top: 10px;
}

img.logo {
  height: 2em;
}

img {
  height: 1.2em;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
}

.underline {
  text-decoration: underline;
}

.navbar {
  align-content: flex-start;
  width: 300px;
  height: 100%;
  position: fixed;
  overflow-y: scroll;
  border-right: 1px solid grey;
  background-color: #dcedff;
}

.navbar::-webkit-scrollbar {
  display: none;
}

li {
  display: block;
}

ul.options li {
  padding: 10px 10px 10px 10px;
}

ul.community {
  padding-left: 0px;
  margin-top: -10px;
}

ul.community li {
  padding: 10px 0px 10px 0px;
}

hr {
  width: 160px;
  height: 1px;
  justify-content: flex-end;
  display: flex;
  padding-left: 10px;
  margin-left: 0.5em;
  border-color: #3b5249;
  background-color: #3b5249;
}
</style>
