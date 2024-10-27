<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import PostComponent from "../Post/PostComponent.vue";
import CommunityBannerComponent from "./CommunityBannerComponent.vue";

const props = defineProps(["title"]);

let posts = ref<Array<Record<string, string>>>([]);
let community = ref<Record<string, string>>({});

async function getCommunityPostIDs(communityID: string) {
  let postIds;
  try {
    postIds = await fetchy(`/api/communities/${communityID}/items`, "GET");
  } catch (_) {
    return;
  }

  return postIds;
}

async function getCommunityPosts(communityID: string) {
  const postIds = await getCommunityPostIDs(communityID);

  const response = await Promise.all(
    postIds.map(async (id: string) => {
      let post;
      try {
        post = await fetchy(`/api/posts/${id}`, "GET");
      } catch (_) {
        return;
      }

      return post;
    }),
  );

  posts.value = response;
}

async function getCommunity(title: string) {
  let response;
  let query: Record<string, string> = title !== undefined ? { title } : {};
  try {
    response = await fetchy(`/api/communities`, "GET", {
      query,
    });
  } catch (_) {
    return;
  }

  community.value = response;
}

onBeforeMount(async () => {
  await getCommunity(props.title);
  await getCommunityPosts(community.value._id);
});
</script>

<template>
  <section>
    <CommunityBannerComponent :title="community.title" :imageIconURL="community.imageIconURL" />
  </section>
  <section class="posts">
    <article v-for="post in posts" :key="post._id">
      <PostComponent :post="post" @refreshPosts="getCommunityPosts(community._id)" />
    </article>
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
