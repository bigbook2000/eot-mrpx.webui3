import { ref } from "vue"
import type { cfunc_boolean } from "@/inc/eotypes"

import eocore from "@/inc/eocore"
import eoflow from "@/inc/eoflow"

import vfiles from "@/components/vfiles.vue"
import TLogic from "@/logic/TLogic"

export function useVflowd(
    emit: (e: "close", cancel: boolean, tag: any, cb: cfunc_boolean) => void
) {

    const x_show_dialog = ref(false);
    const x_show_loading = ref(false);

    const x_flow_title = ref("");
    const v_files_flow = ref<InstanceType<typeof vfiles>>();
    const x_file_type = ref(TLogic.fileTypes["系统_流程文件"]);

    /** 外挂数据  */
    const x_flow_process_data = ref<any>({
        f_flow_process_id: 0,
        f_flow_type_id: 0,
        f_flow_point_pid: 0,
        f_flow_point_id: 0,
        f_user_id: 0,
        f_user_id_s: "",
        f_text: "",
        f_data_id: 0,
        f_op_time: "1970-01-01 00:00:00",
        f_op_flag: eoflow.OP_FLAG_NORMAL,
        v_table: "",
        v_id_field: "",
        v_id_value: 0,
    });

    const onLoading_file = (bshow: boolean) => {
        x_show_loading.value = bshow;
    }

    const show_dialog = (title: string, data: any) => {

        console.log("show_dialog", title, data);
        x_flow_title.value = title;
        v_files_flow.value?.clear_files();

        x_show_dialog.value = true;
        x_flow_process_data.value = { ...data };
    }

    const onDialogOpened = () => {
    }
    const onDialogClose = () => {
    }

    const onButtonClick_Cancel = () => {
        emit("close", true, x_flow_process_data.value, (result: boolean) => {
            x_show_dialog.value = !result;
        });
    }
    const onButtonClick_Ok = async () => {

        x_show_loading.value = true;
        // 先添加流程实例
        let ret = await eocore.post("/framework/flow/process/upd", [x_flow_process_data.value]);
        let data = eocore.check_net_object(ret);
        x_flow_process_data.value = { ...data };

        // 关联附件
        await v_files_flow.value?.update_key_id(x_flow_process_data.value["f_flow_process_id"]);

        emit("close", false, x_flow_process_data.value, (result: boolean) => {
            x_show_loading.value = false;
            x_show_dialog.value = !result;
        });
    }

    return {
        x_show_dialog,
        x_show_loading,
        x_flow_title,
        v_files_flow,
        x_file_type,
        x_flow_process_data,
        onLoading_file,
        show_dialog,
        onDialogOpened,
        onDialogClose,
        onButtonClick_Cancel,
        onButtonClick_Ok,
    }
}
