<script lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import { fetchy } from '@/utils/fetchy';
import { onBeforeMount, ref } from 'vue';
import CommunityBannerComponent from "./CommunityBannerComponent.vue";

const props = defineProps(["title"]);

let posts = ref<Array<Record<string, string>>>([]);
let community = ref<Record<string, string>>({});

async function getCommunityPostIDs(communityID: string) {
    let postIds;
    try {
        postIds = await fetchy(`/api/communities/${communityID}/items`, "GET", {
            body: { communityID },
        });
    } catch (_) {
        return;
    }

    return postIds;
}

async function getCommunityPosts(postIds: string[]) {
    const response = await Promise.all(postIds.map(async id => {
        let post;
        try {
            post = await fetchy(`/api/posts/${id}`, "GET", {
                body: { id },
            });
        } catch (_) {
            return;
        }

        return post;
    }))

    posts.value = response;
}

async function getCommunity(title: string) {
    let response;
    try {
        response = await fetchy(`/api/communities`, "GET",  {
            body: { title: title},
        })
    } catch (_) {
        return;
    }

    community.value = response;
}

onBeforeMount(async () => {
    await getCommunity(props.title);
    const postIds = await getCommunityPostIDs(community.value._id);
    await getCommunityPosts(postIds);
})

</script>

<template>
    <CommunityBannerComponent/>
    <article v-for="post in posts" :key="post._id">
        <PostComponent :post="post"/>
    </article>
</template>