<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { timeFromToday } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import LikeComponent from "../Liking/LikeComponent.vue";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());
const openModal = ref(false);

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};

const openDeleteModal = () => {
  openModal.value = true;
};

const closeDeleteModal = () => {
  openModal.value = false;
};
</script>

<template>
  <div v-if="openModal" id="delete" class="modal">
    <div class="modal-content">
      <p class="question">Are you sure you want to delete your post?</p>
      <menu class="modal-options">
        <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
        <li><button class="btn-small pure-button" @click="closeDeleteModal">Cancel</button></li>
      </menu>
    </div>
  </div>
  <div class="title">
    <p class="author">{{ props.post.author }}</p>
    <p class="date">{{ timeFromToday(props.post.dateCreated) }}</p>
  </div>

  <img v-bind:src="props.post.content" />
  <div class="base">
    <menu v-if="props.post.author == currentUsername">
      <li><button class="button-error btn-small pure-button" @click="openDeleteModal">Delete</button></li>
    </menu>

    <LikeComponent :postID="props.post._id" v-if="isLoggedIn" />
  </div>
</template>

<style scoped>
.modal {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 30%; /* Could be more or less, depending on screen size */
}

.modal-options {
  justify-content: flex-end;
}

.question {
  font-size: 1.3em;
}

/* The Close Button */
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

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
