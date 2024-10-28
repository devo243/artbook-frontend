<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const community = ref("");
const communities = ref<Array<Record<string, string>>>([]);
const validImg = ref(true);
const emit = defineEmits(["refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

const createPost = async (content: string, communityID?: string) => {
  let response;

  try {
    response = await fetchy("/api/posts", "POST", {
      body: { content },
    });

    if (communityID) {
      await fetchy(`/api/communities/${communityID}/items`, "POST", {
        body: { id: communityID, itemID: response.post._id },
      });
    }
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

const getUserCommunities = async (username: string) => {
  let response;
  try {
    response = await fetchy(`/api/users/${username}/communities`, "GET");
  } catch (_) {
    console.log(_);
    return;
  }

  communities.value = response;
};

const emptyForm = () => {
  content.value = "";
  community.value = "";
};

onBeforeMount(async () => {
  await getUserCommunities(currentUsername.value);
});

const imageLoadError = () => {
  validImg.value = false;
};

const previewImage = () => {
  validImg.value = true;
};
</script>

<template>
  <div class="form">
    <form @submit.prevent="createPost(content, community)">
      <label for="community">Choose community:</label>
      <select name="community" v-model="community" id="community">
        <option :value="null">No community</option>
        <option v-for="(c, i) in communities" :key="i" :value="c._id">
          {{ c.title }}
        </option>
      </select>
      <label for="content">Image Link:</label>
      <textarea id="content" v-model="content" placeholder="Place the Image Link you want to share!" required @input="previewImage"> </textarea>
      <label>Preview Image:</label>
      <img v-bind:src="content" v-if="validImg" @error="imageLoadError" />
      <div v-else class="picture">
        <img class="default" src="@/assets/images/photo.svg" />
      </div>
      <button type="submit" class="pure-button-primary pure-button" :disabled="!validImg">Create Post</button>
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

img {
  width: auto;
  height: auto;
  align-self: center;
  max-height: 640px;
  max-width: 480px;
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
  width: 640px;
  height: 480px;
  background-color: white;
  align-self: center;
  justify-content: center;
}
</style>
