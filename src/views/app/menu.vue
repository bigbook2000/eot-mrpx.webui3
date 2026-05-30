<template>
    <div class="eo_page">
        <div class="eo_col">
            <!-- 顶部区域 -->
            <div class="eo_col_d">
                <div class="div_top">
                    <div class="title">
                        <div class="title">{{ x_main_title }}</div>
                    </div>
                    <div class="row">
                        <div class="slogan">{{ TGlobal.appData["slogan"] }}</div>                        
                        <div class="user" @click="goToSettings">                            
                            <span>{{ x_user_name }}</span>
                        </div>
                        <div class="icon" @click="goToSettings">
                            <el-icon><Tools /></el-icon>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 菜单区域 -->
            <div class="eo_col_f">
                <div class="div_menu">
                    <div v-for="group in x_menu_list" :key="group.index" class="menu">
                        <div class="title">
                            <el-icon><HelpFilled /></el-icon>
                            <span>{{ group.title }}</span>
                        </div>
                        <div class="grid">
                            <div v-for="item in group.children" 
                                :key="item.index" 
                                class="item"
                                @click="onMenuSelect_Main(item.path)">
                                <div class="image">
                                    <img :src="`/rc/menu/${item.path}.png`" :alt="item.title" />
                                </div>
                                <div class="text">{{ item.title }}</div>
                            </div>
                        </div>
                    </div>
                    <div style="height: 2rem;"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "app_menu" }
</script>

<script lang="ts" setup>
    import { ref, onMounted } from "vue"
    import router from "@/router/index"

    import { Tools, HelpFilled } from '@element-plus/icons-vue'

    import eocore from "@/inc/eocore"
    import TGlobal from "@/logic/TGlobal"
    import TLogic from "@/logic/TLogic"

    const x_main_title = ref("");
    const x_user_name = ref("");

    const x_menu_list = ref(new Array<any>());

    onMounted(() => {
        x_main_title.value = TGlobal.appData["main_title"];
        x_user_name.value = TGlobal.userData["f_name"];

        x_menu_list.value = TLogic.loadMenuList(1);
    })

    const goToSettings = () => {
        // 跳转到用户设置界面（预留）
        console.log("跳转到用户设置");
    }

    const onMenuSelect_Main = (path: string) => {
        path = path.replace("ext_", "app_");
        console.log(path);
        router.replace({name: path});
    }
</script>

<style lang="scss" scoped>
.div_top {
    background: var(--eo_color_main);
    color: #fff;
    padding: 1rem 2rem;
    box-sizing: border-box;
    height: 9rem;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid var(--eo_color_main);

    .title {
        font-size: 1.6rem;
        font-weight: 600;
        padding: 1rem 0rem 0.2rem 0rem;
    }

    .row {
        display: flex;
        flex-direction: row;

        .slogan {
            flex: 1 1 auto;;
            font-size: 1.2rem;
            color: #fff;
            font-weight: 300;
        }
        .user {
            flex: 0 0 auto;
            width: 10rem;
            text-align: right;
            font-size: 1rem;
            color: #eee;
            padding: 0.2rem 0.2rem 0rem 0.5rem;
        }
        .icon {
            flex: 0 0 auto;
            font-size: 1.2rem;
            color: #eee;
            padding: 0.2rem 0.2rem 0rem 0.5rem;
        }
    }
}

.div_menu {
    padding: 1rem 2rem;
    overflow-y: auto;
    height: 100%;

    .menu {
        padding: 1rem 0rem;
    }
    .title {
        font-size: 1.2rem;
        font-weight: 400;
        color: var(--eo_color_main);
        margin-bottom: 1rem;
        padding: 0rem 0.8rem;
        border-left: 4px solid var(--eo_color_main);
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.2rem;

        .item {
            border-radius: 0.5rem;
            padding: 1rem 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid #e0e0e0;
            
            &:hover {
                background: #f5f5f5;
                border-color: var(--eo_color_main);
            }

            .image {
                width: 4rem;
                height: 4rem;
                border-radius: 0.5rem;
                background: var(--eo_color_main);
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 0.5rem;
                overflow: hidden;
                border: 1px solid var(--eo_color_dark1);
                
                img {
                    width: 2.5rem;
                    height: 2.5rem;
                    object-fit: contain;
                    filter: brightness(0) invert(1);
                }
            }

            .text {
                font-size: 1rem;
                color: #333;
                text-align: center;
            }
        }
    }
}

</style>