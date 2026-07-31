<template>
    <div class="eo_col">
        <div class="eo_col_f">
            <div class="eo_scroll_v">
                <div class="eo_form">
                    <div class="cell eo_w100">
                        <div class="label_n">客户名称<span class="ap_required">*</span></div>
                        <div class="input">
                            <el-input v-model="m_data['f_khmc']" style="width:100%"
                                maxlength="100" placeholder="客户名称" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">联系人<span class="ap_required">*</span></div>
                        <div class="input">
                            <el-input v-model="m_data['f_lxr']" style="width:100%"
                                maxlength="50" placeholder="联系人" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">联系方式<span class="ap_required">*</span></div>
                        <div class="input">
                            <el-input v-model="m_data['f_lxfs']" style="width:100%"
                                maxlength="20" placeholder="联系方式" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">潜在意向</div>
                        <div class="input">
                            <vdic v-model="m_data['f_qzyx']" dic="客户意向" :all="false" field="value" style="width:100%" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">经营状态</div>
                        <div class="input">
                            <vdic v-model="m_data['f_jyzt']" dic="经营状态" :all="false" field="value" style="width:100%" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">客户类别</div>
                        <div class="input">
                            <vdic v-model="m_data['f_khlb']" dic="客户类别" :all="false" field="value" style="width:100%" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">合作等级</div>
                        <div class="input">
                            <vdic v-model="m_data['f_hzdj']" dic="合作等级" :all="false" field="value" style="width:100%" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">客户来源</div>
                        <div class="input">
                            <vdic v-model="m_data['f_khly']" dic="客户来源" :all="false" field="value" style="width:100%" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">公司规模</div>
                        <div class="input">
                            <vdic v-model="m_data['f_gsgm']" dic="经营规模" :all="false" field="value" style="width:100%" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">客户性质</div>
                        <div class="input">
                            <vdic v-model="m_data['f_jyfs']" dic="经营方式" :all="false" field="value" style="width:100%" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">负责人</div>
                        <div class="input">
                            <el-input v-model="m_data['f_fzr']" style="width:100%"
                                maxlength="50" placeholder="负责人" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">公司电话</div>
                        <div class="input">
                            <el-input v-model="m_data['f_gsdh']" style="width:100%"
                                maxlength="20" placeholder="公司电话" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">销售员</div>
                        <div class="input">
                            <el-input v-model="m_data['f_xsy_id_s']" style="width:100%" disabled />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">所属行业</div>
                        <div class="input">
                            <vdic v-model="m_data['f_sshy']" dic="行业类别" :all="false" field="value" style="width:100%" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">行政区划</div>
                        <div class="input">
                            <vregion v-model="m_data['f_xzqh_s']" style="width:100%" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">公司网址</div>
                        <div class="input">
                            <el-input v-model="m_data['f_gswz']" style="width:100%"
                                maxlength="100" placeholder="公司网址" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">公司地址</div>
                        <div class="input">
                            <el-input v-model="m_data['f_gsdz']" style="width:100%"
                                maxlength="200" placeholder="公司地址" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">主营产品</div>
                        <div class="input">
                            <el-input v-model="m_data['f_zycp']" style="width:100%"
                                maxlength="100" placeholder="主营产品" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">经营范围</div>
                        <div class="input">
                            <el-input v-model="m_data['f_jyfw']" style="width:100%"
                                maxlength="200" placeholder="经营范围" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">创建时间</div>
                        <div class="input">
                            <el-input v-model="m_data['f_jdsj_s']" style="width:100%" disabled />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">最近跟进</div>
                        <div class="input">
                            <el-input v-model="m_data['f_gtsj_s']" style="width:100%" disabled />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">最新成交</div>
                        <div class="input">
                            <el-input v-model="m_data['f_cjsj_s']" style="width:100%" disabled />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">成交金额</div>
                        <div class="input">
                            <el-input v-model="m_data['f_cjje_s']" style="width:100%" disabled />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">备注</div>
                        <div class="input">
                            <el-input v-model="m_data['f_beizhu']" style="width:100%"
                                maxlength="200" placeholder="" />
                        </div>
                    </div>
                </div>
                <div style="height:2rem;"></div>
            </div>
        </div>
        <div class="eo_col_d eo_form">
            <div class="button">
                <el-button class="ap_button" type="primary" @click="onSave">保存</el-button>
            </div>
            <div class="button">
                <el-button class="ap_button" @click="onCancel">取消</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { reactive } from "vue"
    import vdic from "@/components/vdic.vue"
    import vregion from "@/components/web/vregion.vue"

    const emit = defineEmits<{
        update: [data: any | null]
    }>();

    let m_data = reactive<any>({});

    const loadData = (data: any) => {
        Object.assign(m_data, data);
    };

    const onSave = () => {
        emit('update', { ...m_data });
    };

    const onCancel = () => {
        emit('update', null);
    };

    defineExpose({ loadData });
</script>
