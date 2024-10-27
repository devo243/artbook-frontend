<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import CommunityComponent from "./CommunityComponent.vue";
import SearchCommunityForm from "./SearchCommunityForm.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let communities = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchTitle = ref("");

async function getCommunities(title?: string) {
  let query: Record<string, string> = title !== undefined ? { title } : {};
  let communityResults;
  try {
    communityResults = await fetchy("/api/communities", "GET", { query });
  } catch (_) {
    return;
  }
  searchTitle.value = title ? title : "";
  communities.value = communityResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getCommunities();
  loaded.value = true;
});
</script>

<template>
  <div class="row">
    <h2 v-if="!searchTitle">Communities:</h2>
    <h2 v-else>Posts by {{ searchTitle }}:</h2>
    <SearchCommunityForm @getCommunitiesByTitle="getCommunities" />
  </div>
  <section class="communities" v-if="loaded && communities.length !== 0">
    <article v-for="community in communities" :key="community._id">
      <CommunityComponent v-if="editing !== community._id" :community="community" @refreshPosts="getCommunities" />
    </article>
  </section>
  <p v-else-if="loaded">No communities found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: white;
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.communities {
  padding: 1em;
  align-items: center;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
