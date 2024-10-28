<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const title = ref("");
const description = ref("");
const icon = ref("");
const validImg = ref(true);
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

const imageLoadError = () => {
  validImg.value = false;
};

const previewImage = () => {
  validImg.value = true;
};
</script>

<template>
  <div class="form">
    <form @submit.prevent="createCommunity(title, description, icon)">
      <label for="title">Add title!:</label>
      <textarea id="title" v-model="title" placeholder="Add your title!" required> </textarea>
      <label for="description">Add Description!:</label>
      <textarea id="description" v-model="description" placeholder="Add your description!" required> </textarea>
      <label for="icon">Add Icon!:</label>
      <textarea id="icon" v-model="icon" placeholder="Add your icon image url!" required @input="previewImage"> </textarea>
      <label>Preview Icon:</label>
      <img v-bind:src="icon" v-if="validImg" @error="imageLoadError" />
      <div v-else class="picture">
        <img class="default" src="@/assets/images/photo.svg" />
      </div>
      <button type="submit" class="pure-button-primary pure-button" :disabled="!validImg">Create Community</button>
    </form>
  </div>
</template>

<style scoped>
.form {
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  padding-top: 50px;
}
form {
  background-color: #ffffff;
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  width: 60%;
  align-self: center;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  background-color: #e7e7e7;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}

img {
  align-self: center;
  height: 160px;
  width: 160px;
  overflow: hidden;
  object-fit: cover;
  border-radius: 100%;
}

.default {
  width: auto;
  height: auto;
  align-self: center;
  max-height: 128px;
  max-width: 96px;
}

.picture {
  display: flex;
  width: 160px;
  height: 160px;
  background-color: white;
  align-self: center;
  justify-content: center;
  border-radius: 100%;
}
</style>
