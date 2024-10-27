<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import PostComponent from "../Post/PostComponent.vue";

let posts = ref<Array<Record<string, string>>>([]);

let isEmpty = ref(false);

const getFeaturedPosts = async () => {
  let featuredPostIds;

  try {
    featuredPostIds = await fetchy("/api/featured", "GET");
  } catch (_) {
    return;
  }

  if (!featuredPostIds) {
    isEmpty.value = true;
  } else {
    isEmpty.value = false;
  }

  const featuredPosts = await Promise.all(
    featuredPostIds.map(async (id: string) => {
      let response;

      try {
        response = await fetchy(`/api/posts/${id}`, "GET");
      } catch (_) {
        return;
      }

      return response;
    }),
  );

  posts.value = featuredPosts;
};

onBeforeMount(async () => {
  await getFeaturedPosts();
});
</script>

<template>
  <section>
    <p>Featured Posts!</p>
    <article v-for="post in posts" :key="post._id">
      <PostComponent :post="post" @refreshPosts="getFeaturedPosts" />
    </article>
    <p v-if="isEmpty">Sorry, no featured posts!</p>
  </section>
</template>

<style>
article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}
</style>
