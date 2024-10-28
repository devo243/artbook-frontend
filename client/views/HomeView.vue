<script setup lang="ts">
import FeaturedPostListComponent from "@/components/Featured/FeaturedPostListComponent.vue";
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Featured</h1>
    <h1 v-if="!isLoggedIn" class="login">Please login!</h1>
    <FeaturedPostListComponent />
    <PostListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: left;
  padding-left: 2em;
  color: #505a5b;
}
</style>
