<template>
    <!-- 三级关联下拉选择，不可输入 -->
    <div class="div_region">
        <el-select :disabled="disabled"
            v-model="x_province" placeholder="省份" style="width:30%"
            @change="onSelectChange_Province">
            <el-option
                v-for="item in x_province_list"
                :key="item.label"
                :label="item.label"
                :value="item.label">
            </el-option>
        </el-select>
        <el-select :disabled="disabled"
            v-model="x_city" placeholder="地市" style="width:30%"
            @change="onSelectChange_City">
            <el-option
                v-for="item in x_city_list"
                :key="item.label"
                :label="item.label"
                :value="item.label">
            </el-option>
        </el-select>
        <el-select :disabled="disabled"
            v-model="x_county" placeholder="区县" style="width:40%"
            @change="onSelectChange_County">
            <el-option
                v-for="item in x_county_list"
                :key="item.label"
                :label="item.label"
                :value="item.label">
            </el-option>
        </el-select>
    </div>
</template>

<script setup lang="ts">

    import { ref, watch } from "vue"

    import region from "@/inc/region";

    const props = withDefaults(defineProps<{
        modelValue: string,
        disabled?: boolean
    }>(), {
        modelValue: "___",
        disabled: false
    })

    const emits = defineEmits<{
        (e: 'update:modelValue', value: number|string): void
        (e: 'change', value: number|string): void
    }>()

    const x_province_list = ref(region.region_list);
    const x_city_list = ref<any[]>([]);
    const x_county_list = ref<any[]>([]);

    /** 选中省份对象 */
    let m_province_data: any = undefined;
    /** 选中地市对象 */
    let m_city_data: any = undefined;
    /** 选中区县对象 */
    let m_county_data: any = undefined;

    const x_province = ref<string>("");
    const x_city = ref<string>("");
    const x_county = ref<string>("");


    /**
     * 主动调用, 避免自动刷新失败
     */
    const set_region_value = (val: string) => {

        console.log("watch", val);

        x_province.value = "";
        x_city.value = "";
        x_county.value = "";

        // 使用下划线分割
        let ss = val.split("_");
        if (ss == null || ss.length != 3) return;

        x_province.value = ss[0];
        x_city.value = ss[1];
        x_county.value = ss[2];

        m_province_data = get_province_data(x_province.value);
        if (m_province_data == undefined) {

            x_city_list.value = [];

            m_city_data = undefined;
            x_county_list.value = [];
            x_city.value = "";

            m_county_data = undefined;
            x_county.value = "";

            return;
        } 

        //console.log("m_province_data", this.m_province_data);
        x_city_list.value = m_province_data.children;
        //console.log("x_city_list", this.x_city_list);

        m_city_data = get_city_data(x_city.value);
        if (m_city_data == undefined) {

            x_city.value = "";

            x_county_list.value = [];

            m_county_data = undefined;
            x_county.value = "";

            return;
        }
        
        //console.log("m_city_data", this.m_city_data);
        x_county_list.value = m_city_data.children;
        //console.log("x_county_list", this.x_county_list);

        m_county_data = get_county_data(x_county.value);
        //console.log("m_county_data", this.m_county_data);
        if (m_county_data == undefined) {
            x_county.value = "";
        } else {
            x_county.value = m_county_data?.label || "";
        }
    }
    
    watch(() => props.modelValue, (newVal, oldVal) => {
        //console.log(newVal, oldVal) 
        
    }, {
        immediate: true,
        deep: false
    });

    const get_province_data = (val: string): any => {
        for (let d of x_province_list.value) {
            if (d.label == val) {
                return d;
            }
        }
        return undefined;
    }
    const get_city_data = (val: string): any => {
        for (let d of x_city_list.value) {
            if (d.label == val) {
                return d;
            }
        }
        return undefined;
    }
    const get_county_data = (val: string): any => {
        for (let d of x_county_list.value) {
            if (d.label == val) {
                return d;
            }
        }
        return undefined;
    }

    const onSelectChange_Province = (val: string): void => {
        
        m_province_data = get_province_data(val);
        if (m_province_data == undefined) {

            x_city_list.value = [];

            m_city_data = undefined;
            x_county_list.value = [];
            x_city.value = "";

            m_county_data = undefined;
            x_county.value = "";

        } else {

            x_city_list.value = m_province_data.children;

            // 切换之后自动选择第一项
            m_city_data = x_city_list.value[0];
            x_county_list.value = m_city_data.children;
            x_city.value = m_city_data.label;

            m_county_data = x_county_list.value[0];
            x_county.value = m_county_data.label;
        }

        //console.log(m_province_data, x_province.value, x_city.value, x_county.value);

        const ret = x_province.value + "_" + x_city.value + "_" + x_county.value;
        emits("update:modelValue", ret);
        // 触发一个事件
        emits("change", ret);
    }
    const onSelectChange_City = (val: string): void => {
        
        m_city_data = get_city_data(val);
        if (m_city_data == undefined) {

            x_county_list.value = [];

            m_county_data = undefined;
            x_county.value = "";

        } else {
        
            x_county_list.value = m_city_data.children;

            m_county_data = x_county_list.value[0];
            x_county.value = m_county_data.label;
        }

        //console.log(x_county_list.value, x_province.value, x_city.value, x_county.value);

        const ret = x_province.value + "_" + x_city.value + "_" + x_county.value;
        emits("update:modelValue", ret);
        // 触发一个事件
        emits("change", ret);
    }
    const onSelectChange_County = (val: any): void => {

        //console.log(this.x_province, this.x_city, this.x_county);

        const ret = x_province.value + "_" + x_city.value + "_" + x_county.value;
        emits("update:modelValue", ret);
        // 触发一个事件
        emits("change", ret);
    }

    defineExpose({
        set_region_value
    })    

</script>

<style lang="scss">
.div_region {
    width: 100%;
    flex-direction: row;
    display: flex;
    box-sizing: border-box;
}
</style>