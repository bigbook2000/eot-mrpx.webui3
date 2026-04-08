<template>
    <!-- 菜单信息 -->
    <vdialog ref="v_dialog"
        width="700px" title="菜单"        
        @close="onDialogClose">
        <div class="eo_form eo_w100">
            <div class="cell eo_w2">
                <div class="label_n">名称</div>
                <div class="input">
                    <el-input v-model="x_menu_data['f_name']" style="width:100%"
                        maxlength="32"></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">上级</div>
                <div class="input">
                    <el-select v-model="x_menu_data['f_menu_pid']"
                        placeholder="请选择上级菜单"
                        style="width:100%">
                        <el-option
                            v-for="item in x_menu_list"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value" />
                    </el-select>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">顺序</div>
                <div class="input">
                    <el-input-number v-model="x_menu_data['f_order']" 
                        :precision="0" :step="1" :min="1" :max="9999"
                        style="width:100%" />
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">类型</div>
                <div class="input">
                    <el-input v-model="x_menu_data['f_type']" style="width:100%"
                        maxlength="32"></el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">路径</div>
                <div class="input">
                    <el-input v-model="x_menu_data['f_path']" style="width:100%"
                        maxlength="256"></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">角色</div>
                <div class="input">
                    <role_input ref="v_role_input" v-model="x_menu_data['f_role']" />
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">图标</div>
                <div class="input">
                    <el-input v-model="x_menu_data['f_icon']" style="width:100%"
                        maxlength="64"></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">状态</div>
                <div class="input">
                    <el-switch v-model="x_menu_data['f_status']" 
                        :active-value="1" :inactive-value="0"></el-switch>
                </div>
            </div>
        </div>
    </vdialog>
</template>

<script setup lang="ts">

    import { ref, reactive, onMounted } from "vue"

    import eocore from "@/inc/eocore";

    import type {cfunc_boolean, cdic_item} from "@/inc/eotypes";

    import vdialog from "@/logic/common/vdialog.vue"
    import role_input from "@/views/platform/role_input.vue"

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    const emits = defineEmits<{
        (e: "close", cancel: boolean, data: any, cb: cfunc_boolean): void
    }>()

    const x_menu_list = ref<any[]>([]);

    var x_menu_data: any = reactive({
    });

    onMounted(() => {
    });

    const show_dialog = (data: any) => {

        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);
        
        // 创建一个副本
        let dataNew = Object.assign({}, data);        
        x_menu_data = reactive(dataNew);
    }

    const onDialogOpened = () => {
    }

    const onDialogClose = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        emits("close", cancel, x_menu_data, (result: boolean) => {
            cb(result);
        });
    }

    const update_list = async (formName: string, list: cdic_item[]) => {
        x_menu_list.value = list;
    }

    defineExpose({
        show_dialog,
        update_list
    })

</script>

<style lang="scss">
</style>