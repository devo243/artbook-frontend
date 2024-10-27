<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["postID"]);
const isFavorited = ref(false);
const { currentUsername } = storeToRefs(useUserStore());

const checkIfFavorited = async () => {
  let response;
  try {
    response = await fetchy(`/api/users/${currentUsername.value}/favorites/${props.postID}`, "GET");
  } catch (_) {
    return;
  }

  if (response) {
    isFavorited.value = true;
  } else {
    isFavorited.value = false;
  }
};

const favorite = async () => {
  try {
    await fetchy(`/api/posts/${props.postID}/favorites`, "POST", {
      body: { id: props.postID },
    });
  } catch (_) {
    return;
  }

  isFavorited.value = true;

  try {
    const numFavorites = await fetchy(`/api/posts/${props.postID}/favorites`, "GET");

    await fetchy(`/api/featured`, "POST", {
      body: { item: props.postID, attention: numFavorites.numFavorites },
    });
  } catch (_) {
    console.log(_);
    return;
  }
};

const unfavorite = async () => {
  try {
    await fetchy(`/api/posts/${props.postID}/favorites`, "DELETE");
  } catch (_) {
    return;
  }

  isFavorited.value = false;
};

const onClick = async () => {
  if (isFavorited.value) {
    await unfavorite();
  } else {
    await favorite();
  }
};

onBeforeMount(async () => {
  await checkIfFavorited();
});
</script>

<template>
  <div>
    <button @click="onClick">
      <img v-if="isFavorited" src="@/assets/images/star.svg" id="favorited" />
      <img v-else src="@/assets/images/star.svg" />
    </button>
  </div>
</template>

<style scoped>
#favorited {
  filter: invert(73%) sepia(76%) saturate(972%) hue-rotate(347deg) brightness(100%) contrast(104%) saturate(100%);
}

img {
  width: 30px;
  height: 100%;
}

button {
  border: 0px;
}
</style>
