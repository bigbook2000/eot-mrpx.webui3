<template>
    <!-- 文件上传 -->
    <div class="sv_file">
        <div class="border">
            <div class="remove" @click="onButtonClick_Remove" v-if="!readOnly">
                <el-icon size="14" color="#666">
                    <Delete />
                </el-icon>
            </div>
            <div class="download">
                <a :href="x_file_url" target="_blank">{{ x_file_name }}</a>
            </div>
            <div v-if="!readOnly">
                <el-upload
                    ref="v_upload"
                    name="file"
                    :action="x_action_url"
                    :headers="x_file_headers"
                    :accept="x_file_types"
                    :data="x_post_data"
                    :show-file-list="false"
                    :on-remove="onFileRemove"
                    :on-success="onFileSuccess"
                    :on-error="onFileError"
                    :on-change="onFileChange"
                    :on-progress="onFileProgress"
                    :before-upload="onBeforeUpload"
                    :before-remove="onBeforeRemove"
                    :limit="0"
                    :file-list="x_file_list"
                    :auto-upload="true">
                    <div class="upload" slot="trigger">
                        <el-icon size="14" color="#c01020">
                            <Edit />
                        </el-icon>
                    </div>
                </el-upload>
            </div>
        </div>
  </div>
</template>

<script setup lang="ts">

    import { ref, watch, onMounted } from "vue"

    import { ElUpload } from 'element-plus'
    import type { UploadRawFile, UploadFile, UploadFiles, UploadProgressEvent } from 'element-plus'

    import eocore from "@/inc/eocore";
    import eolib from "@/inc/eolib";

    import TLogic from "@/logic/TLogic";

    import type { cfunc_loading, cfile_func_name } from "@/inc/eotypes";

    /**
     * modelValue 绑定四个参数，使用|分割 
     * file_id|type|keyid|index
     * 
     * type 每个具体的应用模块对应不同的文件类别，在TLogic定义
     * keyid 关联每个设备版本的 version_id
     * index 附加，如果每个keyid可以对应多文件，index即为文件索引
     * 
     * withDefaults 绑定对象或数组需要使用函数初始化 modelValue: () => { return {} }
     * 
     */
    const props = withDefaults(defineProps<{
        modelValue: number,
        type: string,
        index: number,
        readOnly?: boolean,
        onLoading?: cfunc_loading,
        onFileName?: cfile_func_name
    }>(), {
        modelValue: 0,
        type: "",
        index: 0,
        readOnly: false,
        onLoading: undefined,
        onFileName: undefined
    })

    const emits = defineEmits<{
        (e: 'update:modelValue', value: string): void
        (e: "complete", data: any): void
    }>()
    
    const x_action_url = ref(eocore.base_url + "/framework/hdata/xsave/upd");

    /**
     * 文件上传HTTP Head，请不要添加 Content-Type
     */
    const x_file_headers = ref({
        "Authorization": eocore.token,
        //"Content-Type": "application/x-www-form-urlencoded"
        //"Content-Type": "multipart/form-data"        
    });
    const x_file_types = ref("*");
    const x_post_data = ref({        
        "v_type": "",
        "v_keyid": 0,
        "v_index": 0,
        "v_name": ""
    });

    let m_key_id = 0;

    const x_file_url = ref("#");
    const x_file_name = ref("");
    const x_file_list = ref<any[]>([]);

    const v_upload = ref<InstanceType<typeof ElUpload>>();

    onMounted(() => {
    });
    /**
     * 清除文件
     */
    const clear_file = () => {

        v_upload.value!.clearFiles();

        x_file_url.value = "#";
        x_file_name.value = "";
        x_file_list.value = [];
    }

    const onFileRemove = (file: UploadFile, fileList: UploadFiles) => {

    }
    const onFileSuccess = (response: any, file: UploadFile, fileList: UploadFiles) => {
        console.log(response);

        let data = eocore.check_net_object({
            data: response
        });
        if (data == null) return;

        x_file_url.value = TLogic.getXSaveDataUrl(data["f_file_id"]);
        x_file_name.value = data["f_name"];
        
        if (props.onLoading != undefined) props.onLoading(false);
        //console.log(this.x_file_list);

        //let valueStr = data["f_file_id"] + "|" + data["f_type"] + "|" + data["f_keyid"] + "|" + data["f_index"];
        //console.log(valueStr);

        let valueStr = data["f_file_id"];
        emits("update:modelValue", valueStr);
        emits("complete", data);
    }
    const onFileError = (err: Error, file: UploadFile, fileList: UploadFiles) => {
        //console.log(err);
        if (props.onLoading != undefined) props.onLoading(false);
    }
    const onFileChange = (file: UploadFile, fileList: UploadFiles) => {
        //console.log(file);
    }
    const onFileProgress = (event: UploadProgressEvent, file: UploadFile, fileList: UploadFiles) => {
    }
    const onBeforeUpload = (rawFile: UploadRawFile): any => {

        //console.log(file);

        if (props.onLoading != undefined) props.onLoading(true);

        let fi: string[] = eolib.string_part_last(rawFile.name, "/", ".");
        let fn = "";
        if (props.onFileName != undefined)
            fn = props.onFileName(rawFile.name);
        else
            fn = fi[1];

        x_post_data.value = {
            "v_type": props.type,
            "v_keyid": m_key_id,
            "v_index": props.index,
            "v_name": fn
        };
    }
    const onBeforeRemove = (file: UploadFile, fileList: UploadFiles): any => {
        //console.log(file);
    }

    /**
     * 点击移除
     */
    const onButtonClick_Remove = () => {
        clear_file();
    }

    const update_key_id = async (keyId: number): Promise<void> => {
        m_key_id = keyId;
        
        let fileId = props.modelValue;
        //console.log("update_key_id", fileId, keyId);
        if (fileId > 0 && keyId > 0) {

            let ret = await eocore.post("/framework/hdata/file/key", [{
                "v_file_id": fileId,
                "v_keyid": keyId
            }]);
            let data = eocore.check_net_object(ret);
            if (data == undefined) return;
        }
    }

    defineExpose({
        clear_file,
        update_key_id
    })

</script>

<style lang="scss">
</style>