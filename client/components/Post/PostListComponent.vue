<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import SearchPostForm from "./SearchPostForm.vue";

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");

async function getPosts(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query });
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  posts.value = postResults;
}

onBeforeMount(async () => {
  await getPosts();
  loaded.value = true;
});
</script>

<template>
  <div class="row">
    <h2 v-if="!searchAuthor">All posts:</h2>
    <h2 v-else>Posts by {{ searchAuthor }}:</h2>
    <SearchPostForm @getPostsByAuthor="getPosts" />
  </div>
  <section class="posts" v-if="loaded && posts.length !== 0">
    <div v-for="post in posts" :key="post._id">
      <article>
        <PostComponent :post="post" @refreshPosts="getPosts" />
      </article>
      <hr />
    </div>
  </section>
  <p v-else-if="loaded">No posts found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
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
  height: 2px;
  color: #000;
  width: 100%;
}
</style>
