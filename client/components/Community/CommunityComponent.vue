<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["community"]);
const emit = defineEmits(["refreshCommunities"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteCommunity = async () => {
  try {
    await fetchy(`/api/communities/${props.community._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshCommunities");
};

const joinCommunity = async () => {
  try {
    await fetchy(`/api/communities/${props.community._id}/join`, "PATCH");
  } catch {
    return;
  }
};

const leaveCommunity = async () => {
  try {
    await fetchy(`/api/communities/${props.community._id}/leave`, "PATCH");
  } catch {
    return;
  }
};

console.log(props.community);

// const getGoogleID = (link: string) => {
//   return link.split("/")[5];
// };
</script>

<template>
  <p class="title">{{ props.community.title }}</p>
  <p>Description: {{ props.community.description }}</p>
  <RouterLink :to="'/community/' + props.community.title" class="link">Click here to go to community!</RouterLink>
  <div class="base">
    <menu v-if="props.community.author == currentUsername">
      <li><button class="btn-small pure-button" @click="joinCommunity">Join</button></li>
      <li><button class="btn-small pure-button" @click="leaveCommunity">Leave</button></li>
      <li><button class="button-error btn-small pure-button" @click="deleteCommunity">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.community.dateCreated !== props.community.dateUpdated">Edited on: {{ formatDate(props.community.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.community.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.title {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
