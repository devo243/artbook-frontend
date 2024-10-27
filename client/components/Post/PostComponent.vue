<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { timeFromToday } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import LikeComponent from "../Liking/LikeComponent.vue";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};
</script>

<template>
  <div class="title">
    <p class="author">{{ props.post.author }}</p>
    <p class="date">{{ timeFromToday(props.post.dateCreated) }}</p>
  </div>

  <img v-bind:src="props.post.content" />
  <div class="base">
    <menu v-if="props.post.author == currentUsername">
      <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>

    <LikeComponent :postID="props.post._id" />
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

.title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}

.date {
  font-style: italic;
  color: rgb(94, 94, 94);
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

img {
  width: auto;
  height: auto;
  align-self: center;
  max-height: 640px;
  max-width: 480px;
}
</style>
