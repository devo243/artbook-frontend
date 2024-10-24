<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { fetchy } from "../../utils/fetchy";

const { currentUsername } = storeToRefs(useUserStore());
const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const communities = ref<Array<Record<string, string>>>([]);

const getUserCommunities = async (username: string) => {
  let response;
  try {
    response = await fetchy(`/api/users/${username}/communities`, "GET");
  } catch (_) {
    console.log(_);
    return;
  }
  
  communities.value = response;
}

onBeforeMount(async () => {
  await getUserCommunities(currentUsername.value);
})
</script>

<template>
    <div class="navbar">
        <ul class="options">
            <li>
                <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }"> Home </RouterLink>
            </li>
            <li>
                Profile
            </li>
            <li>
                Settings
            </li>
            <hr/>
            <li>
                Communities
            </li>
            <li>
                <ul class="community">
                    <li v-for="(c, i) in communities" :key="i">
                        {{ c.title }}
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.navbar {
    align-content: flex-end;
    width: 100%;
}

li {
    display: block;
}

ul.options li {
    padding: 10px 10px 10px 10px;
}

ul.community {
    padding-left: 0px;
}

ul.community li{
    padding: 10px 0px 10px 0px;
}

hr {
    width: 80px;
    justify-content: flex-end;
    display: flex;
    padding-left: 20px;
    margin-left: 0.5em;
}
</style>