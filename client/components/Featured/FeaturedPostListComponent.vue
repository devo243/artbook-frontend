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
    <section class="posts">
      <article v-for="post in posts" :key="post._id">
        <PostComponent :post="post" @refreshPosts="getFeaturedPosts" />
      </article>
    </section>
    <p v-if="isEmpty">Sorry, no featured posts!</p>
  </section>
</template>

<style>
section {
  display: flex;
  flex-direction: column;
  gap: 0;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: white;
  /* border-radius: 1em; */
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  width: 480px;
}

.posts {
  padding: 1em;
  align-items: center;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}

hr {
  height: 2px;
  color: #000;
  width: 100%;
}
</style>
