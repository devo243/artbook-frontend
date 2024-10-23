<script setup lang="ts">
const props = defineProps(["title", "imageIconURL"]);
</script>

<template>
    <div class="banner">
        <img class="icon" v-bind:src="props.imageIconURL"/>
        <p>{{ props.title }}</p>
    </div>
</template>