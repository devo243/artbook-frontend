<script setup lang="ts">
import { ref } from "vue";

const title = ref("");
const emit = defineEmits(["getCommunitiesByTitle"]);
</script>

<template>
  <form @submit.prevent="emit('getCommunitiesByTitle', title)" class="pure-form">
    <fieldset>
      <legend>Search by Author</legend>
      <input id="author" type="text" v-model="title" placeholder="Username" />
      <button type="submit" class="pure-button pure-button-primary">Search</button>
    </fieldset>
  </form>
</template>

<style scoped>
form {
  display: flex;
  gap: 0.5em;
  padding: 1em;
  align-items: center;
}
</style>
