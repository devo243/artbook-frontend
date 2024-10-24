<script setup lang="ts">
import { fetchy } from '@/utils/fetchy';
import { onBeforeMount, ref } from 'vue';
import PostComponent from '../Post/PostComponent.vue';
import CommunityBannerComponent from './CommunityBannerComponent.vue';

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

async function getCommunityPosts(postIds: string[]) {
    const response = await Promise.all(postIds.map(async id => {
        let post;
        try {
            post = await fetchy(`/api/posts/${id}`, "GET");
        } catch (_) {
            return;
        }

        return post;
    }))

    posts.value = response;
}

async function getCommunity(title: string) {
    let response;
    let query: Record<string, string> = title !== undefined ? { title } : {};
    try {
        response = await fetchy(`/api/communities`, "GET",  {
            query,
        })
    } catch (_) {
        return;
    }

    community.value = response;
}

onBeforeMount(async () => {
    await getCommunity(props.title);
    const postIds = await getCommunityPostIDs(community.value._id);
    console.log(postIds);
    await getCommunityPosts(postIds);
})

</script>

<template>
    <section>
        <CommunityBannerComponent :title="community.title" :imageIconURL="community.imageIconURL"/>
    </section>
    <section>
        <article v-for="post in posts" :key="post._id">
            <PostComponent :post="post"/>
        </article>
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