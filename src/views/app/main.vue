<template>
    <div class="eo_page">
        <div class="eo_col">
            <div class="eo_col_d">
                <div class="div_top">
                    <div>{{ x_main_title }}</div>
                    <div>{{ TGlobal.appData["slogan"] }}</div>
                    <div>{{ x_user_name }}</div>
                </div>
            </div>
            <div class="eo_col_f">
                <div class="div_menu">
                    <div v-for="item in x_menu_list" :key="item.index" class="div_menu_item">
                        <div>{{ item.title }}</div>
                        <div>
                            <div v-for="subItem in item.children" :key="subItem.index">
                                {{ subItem.title }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "app_main" }
</script>

<script lang="ts" setup>

    import { ref, nextTick } from "vue"
    import { onMounted } from 'vue'
    import router from "@/router/index"

    import eocore from "@/inc/eocore"
    import TGlobal from "@/logic/TGlobal"
    import TLogic from "@/logic/TLogic"

    const x_main_title = ref("");
    const x_user_name = ref("");

    const x_menu_list = ref(new Array<any>());

    onMounted(() => {

        x_main_title.value = TGlobal.appData["main_title"];
        x_user_name.value = TGlobal.userData["f_name"];

        x_menu_list.value =  TLogic.loadMenuList();    
    })
</script>

<style lang="scss" scoped>
.div_top {
    height: 20rem;
    background-color: var(--eo_color_main);
    color: #fff;
    box-sizing: border-box;
}
</style>