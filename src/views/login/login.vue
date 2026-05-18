<template>
    <div class="eo_page">
        <div class="div_back">
            <div class="eo_col">
                <div class="eo_col_f">
                    
                    <!-- 登录面板 begin -->
                    <div class="div_login">
                        <div class="border">
                            <div class="panel">                            
                                <div class="title">{{ x_main_title }}</div>
                                <div style="height:30px"></div>
                                <div class="row">
                                    <el-input v-model="x_login_id" placeholder="请输入账号"></el-input>
                                </div>
                                <div class="row">
                                    <el-input v-model="x_login_psw" placeholder="请输入密码" show-password></el-input>
                                </div>
                                <div class="row">
                                    <el-button type="primary" class="eo_w100"
                                    @click="onButtonClick_Login" :disabled="x_login_disable">登录</el-button>
                                </div>
                                <div class="info">{{x_login_info}}</div>
                            </div>
                        </div>
                    </div>
                    <!-- 登录面板 end -->
                </div>
                <div class="eo_col_d">
                    <div style="height:100px;"></div>
                    <div class="div_copyright">
                        <span>{{ x_copyright + " " + x_version }}</span>
                    </div>
                    <div style="height:50px;"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

    import { ref, onMounted } from "vue"

    import router from "@/router/index";

    import tmd5 from "@/inc/tmd5";
    import eocore from "@/inc/eocore";
    import TGlobal from "@/logic/TGlobal";
    import TLogic from "@/logic/TLogic";
    import eoflow from "@/inc/eoflow";

    var x_login_id = ref("");
    var x_login_psw = ref("");
    var x_login_disable = ref(false);
    var x_login_info = ref("");

    var x_main_title = ref("");
    var x_copyright = ref("");
    var x_version = ref("");

    onMounted(async () => {
        x_main_title.value = TGlobal.appData["main_title"];
        x_copyright.value = TGlobal.appData["copyright"];
        x_version.value = TGlobal.appData["version"];
    })

    const onButtonClick_Login = async () => {

        x_login_disable.value = true;
        
        // 非明文传输
        let loginPswMd5 = tmd5.hexMD5(x_login_psw.value);

        let ret: any = await eocore.post("/framework/user/login", [{
            version: 0,
            mode: 1,
            login_id: x_login_id.value,
            login_psw: loginPswMd5,
        }]);
        
        let info: string = eocore.get_info(ret, 0);
        if (!eocore.check_empty(info)) {
            x_login_info.value = info;
            x_login_disable.value = false;
            return;
        }
        if (eocore.check_empty(ret.data._list)) {
            x_login_info.value = "账号或密码错误";
            x_login_disable.value = false;
            return;
        }

        TGlobal.userData = ret.data._list[0];

        // 获取权限
        let permits = TGlobal.userData["f_permits"];
        TGlobal.userData["f_permits"] = "";
        
        let role = TGlobal.userData["f_role"];
        TGlobal.userData.role_list = role.split(",").filter((item: any) => item != "");
        TGlobal.permitString = permits;


        // 初始化流程
        await eoflow.net_load_flow_List();

        // 加载用户字典
        await TLogic.netLoad_UserDic();
        // 加载菜单列表
        await TLogic.netLoad_menu_list();

        x_login_disable.value = false;
        
        if (TGlobal.__GPF_ == "app") {
            router.replace({ name:'app_main' });
        } else {
            router.replace({ name:'main' });
        }
    }
    
     

</script>
<style scoped lang="scss">
.div_back {
    width: 100%;
    height: 100%;
    background-color: var(--eo_color_back);
}

/** 桌面端适配 */
@media screen and (min-width: 1200px) {
.div_login {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .border {        
        width: 32rem;
        border: 1px solid var(--eo_color_dark1);
        border-radius: 1rem;

        .panel {
            .title {
                text-align: center;
                background-color: var(--eo_color_dark1);
                padding: 1rem;
                font-size: 1.5rem;
                color: #fff;
                border-top-left-radius: 1rem;
                border-top-right-radius: 1rem;
                box-sizing: border-box;
            }
            .row {
                padding: 1rem 2rem;
                box-sizing: border-box;
            }
            .info {
                padding: 1rem 2rem;
                box-sizing: border-box;
                height: 6rem;
                color: #4099ff;
                word-break: break-all;
                word-wrap: break-word;
            }
        }
    }
}
.div_copyright {
    font-size: 1.2rem;
    color: #666;
    padding: 0.5rem;
    text-align: center;
}
}

/** 移动端适配 */
@media screen and (max-width: 1200px) {
.div_login {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .border {        
        width: 60rem;
        border: 1px solid var(--eo_color_dark1);
        border-radius: 5rem;

        .panel {
            .title {
                text-align: center;
                background-color: var(--eo_color_dark1);
                padding: 2rem;
                font-size: 2rem;
                color: #fff;
                border-top-left-radius: 5rem;
                border-top-right-radius: 5rem;
                box-sizing: border-box;
            }
            .row {
                padding: 2rem 4rem;
                box-sizing: border-box;
            }
            .info {
                padding: 2rem 4rem;
                box-sizing: border-box;
                height: 10rem;
                color: #4099ff;
                word-break: break-all;
                word-wrap: break-word;
            }
        }
    }
}
.div_copyright {
    font-size: 14px;
    color: #333;
    padding: 5px;
    text-align: center;
}
}
</style>