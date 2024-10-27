<script setup lang="ts">
const props = defineProps(["title", "imageIconURL"]);
</script>

<template>
    <div class="banner">
        <img class="icon" v-bind:src="props.imageIconURL"/>
        <p class="title">{{ props.title }}</p>
    </div>
</template>

<style scoped>
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

.title {
    margin-left: 20px;
    font-size: 2em;
    font-weight: bold;
}

img {
    width: 160px;
    height: 160px;
    overflow: hidden;
    border-radius: 100%;
    object-fit: cover;
}
</style>