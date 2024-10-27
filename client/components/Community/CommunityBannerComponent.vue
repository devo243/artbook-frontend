<script setup lang="ts">
import { fetchy } from '@/utils/fetchy';
const props = defineProps(["community"]);

const joinCommunity = async () => {
  try {
    await fetchy(`/api/communities/${props.community._id}/join`, "POST");
  } catch {
    return;
  }
};

const leaveCommunity = async () => {
  try {
    await fetchy(`/api/communities/${props.community._id}/leave`, "DELETE");
  } catch {
    return;
  }
};
</script>

<template>
    <div class="banner">
        <img class="icon" v-bind:src="props.community.imageIconURL"/>
        <div class="text">
            <p class="title">{{ props.community.title }}</p>
            <p class="description">
                {{ props.community.description }}
            </p>
            <menu>
                <li><button class="btn-small pure-button" @click="joinCommunity">Join</button></li>
                <li><button class="button-error btn-small pure-button" @click="leaveCommunity">Leave</button></li>
            </menu>
        </div>
    </div>
</template>

<style scoped>
menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 10px 0px 0px 0px;

  margin: 0;
}

.banner {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    align-self: center;
    /* width: 400px; */
    width: 100%;
    padding: 40px;
    margin-top: 40px;
    flex-direction: row;
    flex-grow: 0;
    background-color: #A4B494;
    border-radius: 20px;
}

.text {
    margin-left: 20px;
}

.title {
    font-size: 2em;
    font-weight: bold;
}

.description {
    color: rgb(49, 48, 48);
    font-size: 1.2em;
    padding-top: 5px;
}

img {
    width: 160px;
    height: 160px;
    overflow: hidden;
    border-radius: 100%;
    object-fit: cover;
}
</style>