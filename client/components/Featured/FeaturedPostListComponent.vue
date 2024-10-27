<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import PostComponent from "../Post/PostComponent.vue";

let posts = ref<Array<Record<string, string>>>([]);

const getFeaturedPosts = async () => {
  let featuredPostIds;

  try {
    featuredPostIds = await fetchy("/api/featured", "GET");
  } catch (_) {
    return;
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

  posts.value = featuredPosts.filter((p) => p !== undefined);
};

onBeforeMount(async () => {
  await getFeaturedPosts();
});
</script>

<template>
  <section>
    <section class="posts">
      <div v-for="post in posts" :key="post._id">
        <article>
          <PostComponent :post="post" @refreshPosts="getFeaturedPosts" />
        </article>
        <hr />
      </div>
    </section>
    <p v-if="posts.length === 0">Sorry, no featured posts!</p>
  </section>
</template>

<style>
section {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: rgb(255, 255, 255);
  border-radius: 0.5em;
  box-shadow: 4px 4px 10px 5px rgb(194, 194, 194);
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
  margin-top: 1em;
  height: 2px;
  color: #000;
  width: 100%;
}
</style>
