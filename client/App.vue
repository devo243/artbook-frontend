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
}

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
    await getUserCommunities(currentUsername.value);
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <div class="container">
    <div class="navbar">
      <div class="title">
          <img src="@/assets/images/logo.svg" />
          <RouterLink :to="{ name: 'Home' }">
            <h1>artBook</h1>
          </RouterLink>
      </div>
      <ul class="options">
        <li>
          <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }"> Home </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          Profile
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }"> Settings </RouterLink>
        </li>
        <li>
          Search
        </li>
        <li v-if="isLoggedIn">
          Create Post
        </li>
        <hr v-if="isLoggedIn"/>
        <li v-if="isLoggedIn">
          Communities
        </li>
        <li v-if="isLoggedIn">
          Create Community
        </li>
        <li v-if="isLoggedIn">
          <ul class="community">
            <li v-for="(c, i) in communities" :key="i">
              <RouterLink :to="'/community/' + c.title" :class="{ underline: currentRouteName == 'Community' }">{{ c.title }}</RouterLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  <div class="page">
    <RouterView />
  </div>
</div>
</template>

<style scoped>
@import "./assets/toast.css";

.container {
  display: flex;
}

.page {
  flex-grow: 1;
  margin: 0 0 0 300px;
  overflow-x: hidden;
}

h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
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
}

ul.community li{
    padding: 10px 0px 10px 0px;
}

hr {
    width: 80px;
    justify-content: flex-end;
    display: flex;
    padding-left: 20px;
    margin-left: 0.5em;
}
</style>
