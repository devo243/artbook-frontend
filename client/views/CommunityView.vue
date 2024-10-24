<script setup lang="ts">
import CommunityPostListComponent from "@/components/Community/CommunityPostListComponent.vue";

const props = defineProps(["title"]);
</script>

<template>
  <CommunityPostListComponent :title="props.title" />
</template>
