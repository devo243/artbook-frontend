<script setup lang="ts">
const props = defineProps(["community"]);
</script>

<template>
    <div class="banner">
        <img class="icon" v-bind:src="props.community.imageIconURL"/>
        <p>{{ props.community.title }}</p>
    </div>
</template>