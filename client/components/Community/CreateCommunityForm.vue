<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const title = ref("");
const description = ref("");
const icon = ref("");
const emit = defineEmits(["refreshCommunities"]);

const createCommunity = async (title: string, description: string, imageIconURL: string) => {
  try {
    await fetchy("/api/communities", "POST", {
      body: { title: title, description: description, imageIconURL: imageIconURL },
    });
  } catch (_) {
    return;
  }
  emit("refreshCommunities");
  emptyForm();
};

const emptyForm = () => {
  title.value = "";
  description.value = "";
  icon.value = "";
};
</script>

<template>
  <form @submit.prevent="createCommunity(title, description, icon)">
    <label for="title">Add title!:</label>
    <textarea id="title" v-model="title" placeholder="Add your title!" required> </textarea>
    <label for="description">Add Description!:</label>
    <textarea id="description" v-model="description" placeholder="Add your description!" required> </textarea>
    <label for="icon">Add Icon!:</label>
    <textarea id="icon" v-model="icon" placeholder="Add your icon image url!" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Community</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
