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

  posts.value = response.filter((r) => r !== undefined);
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
  <CommunityBannerComponent :community="community" />

  <h2>Posts:</h2>
  <section class="posts">
    <div v-for="post in posts" :key="post._id">
      <article>
        <PostComponent :post="post" @refreshPosts="getCommunityPosts" />
      </article>
      <hr />
    </div>
    <p v-if="posts.length === 0">No posts in these community!</p>
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

h2 {
  margin-left: 20%;
  padding-top: 20px;
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
  height: 0px;
  width: 100%;
  border-color: #ffffff;
  background-color: #3b5249;
}
</style>
