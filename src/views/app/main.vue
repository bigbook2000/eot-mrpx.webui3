<template>
    <router-view v-slot="{ Component }">
        <keep-alive :include="x_keep_alive_list">
            <component :is="Component" />
        </keep-alive>
    </router-view>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "app_main" }
</script>

<script lang="ts" setup>

    import { ref, onMounted } from "vue"
    import router from "@/router/index"

    /** 缓存列表 - 自动缓存访问过的app页面 */
    const x_keep_alive_list = ref<string[]>([]);

    /** 注册导航守卫：前进时缓存当前页，back时移除当前页 */
    router.beforeEach((to, from) => {
        if (from.name && from.name !== 'app_main' && (from.name as string).startsWith('app_')) {
            const fromName = from.name as string;
            const toName = to.name as string;
            const idx = x_keep_alive_list.value.indexOf(fromName);
            if (x_keep_alive_list.value.includes(toName)) {
                // 返回操作：目标已在缓存中，移除当前页
                if (idx >= 0) {
                    x_keep_alive_list.value.splice(idx, 1);
                }
            } else {
                // 前进操作：缓存当前页
                if (idx < 0) {
                    x_keep_alive_list.value.push(fromName);
                }
            }
        }
        return true;
    });

    onMounted(() => {
        router.replace({name: 'app_menu'});
    })

</script>

<style lang="scss" scoped>
</style>