<template>
    <div class="eo_col">
        <div class="eo_col_f">
            <div class="eo_scroll_v">
                <!-- 产品信息表单 - App端 -->
                <div class="eo_form">
                    <div class="cell eo_w100">
                        <div class="label_n">大类</div>
                        <div class="input">
                            <el-select v-model="cpdyData['f_cpdl_id']"
                                @change="$emit('selectCpdl', $event)"
                                placeholder="请选择" style="width:100%">
                                <el-option v-for="item in cpdlList"
                                    :key="item['value']"
                                    :label="item['label']"
                                    :value="item['value']" />
                            </el-select>
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">小类</div>
                        <div class="input">
                            <el-select v-model="cpdyData['f_cpxl_id']"
                                placeholder="请选择" style="width:100%">
                                <el-option v-for="item in cpxlList"
                                    :key="item['value']"
                                    :label="item['label']"
                                    :value="item['value']" />
                            </el-select>
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">名称</div>
                        <div class="input">
                            <el-input v-model="cpdyData['f_cpmc']" style="width:100%"
                                maxlength="32" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">编码</div>
                        <div class="input">
                            <el-input v-model="cpdyData['f_cpbm']" style="width:100%"
                                readonly />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">规格</div>
                        <div class="input">
                            <el-input v-model="cpdyData['f_cpgg']" style="width:100%"
                                maxlength="32" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">尺寸</div>
                        <div class="input">
                            <el-input v-model="cpdyData['f_cpcc']" style="width:100%"
                                maxlength="32" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">重量</div>
                        <div class="input">
                            <el-input v-model="cpdyData['f_cpzl']" style="width:100%"
                                maxlength="32" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">单位</div>
                        <div class="input">
                            <el-input v-model="cpdyData['f_cpdw']" style="width:100%"
                                maxlength="32" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">单件数量</div>
                        <div class="input">
                            <el-input-number style="width:100%"
                                v-model="cpdyData['f_bzsl']"
                                :step="1" :min="0" :max="999999" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">定价</div>
                        <div class="input">
                            <el-input-number style="width:100%"
                                v-model="cpdyData['f_cpjg']"
                                :precision="3" :step="1" :min="0.0" :max="999999.99" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">状态</div>
                        <div class="input">
                            <vdic style="width:100%" dic="产品状态" :all="false" field="value"
                                v-model="cpdyData['f_cpzt']" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">库存单价</div>
                        <div class="input">
                            <el-input v-model="cpdyData['f_kcdj_s']" style="width:100%"
                                disabled />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">库存数量</div>
                        <div class="input">
                            <el-input v-model="cpdyData['f_kcsl']" style="width:100%"
                                disabled />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">描述</div>
                        <div class="input">
                            <el-input v-model="cpdyData['f_cpms']" style="width:100%"
                                maxlength="200" />
                        </div>
                    </div>        
                </div>
                <div style="height:2rem;"></div>
            </div>
        </div>
        <div class="eo_col_d eo_form">
            <div class="button">
                <el-button class="ap_button" type="primary" @click="$emit('confirm')">保存</el-button>
            </div>
            <div class="button">
                <el-button class="ap_button" @click="$emit('cancel')">取消</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import vdic from "@/components/web/vdic.vue"

    defineProps<{
        cpdyData: any;
        cpdlList: any[];
        cpxlList: any[];
    }>();

    defineEmits<{
        selectCpdl: [value: any];
        confirm: [];
        cancel: [];
    }>();
</script>
