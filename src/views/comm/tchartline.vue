<script setup lang="ts">

    import { ref, reactive, onMounted } from "vue"

    import eocore from '@/inc/eocore';
    import TGlobal from '@/logic/TGlobal'

    import * as echarts from 'echarts';
    type EChartsOption = echarts.EChartsOption;

    var v_chart_id = ref("v_chart_" + (Math.random() * 1000000).toFixed(0));
    var m_chart: any; 

    onMounted(() => {

        var chartDom = document.getElementById(v_chart_id.value)!;
        m_chart = echarts.init(chartDom);
    })

    /**
     * 
     * 为了不用单位的数据显示在统一图表上，需要对图表的值进行处理，但显示标签时还显示原始值
     * 
     * @param list 数据列表
     * @param xName x轴字段名
     * @param chartField 图表字段名
     * @param labelField 数据字段名（原始值）
     * @param dataFields 字段列表
     */
    const update_data = (list: any[], xName: string, chartField: string, labelField: string, dataFields: any[]) => {

        //console.log(list, xName, chartField, labelField, dataFields);

        let xData: any[] = [];
        let series: any[] = [];

        // 名字转换成字段
        let mapField: any = {};

        for (let df of dataFields) {

            mapField[df["f_label"]] = df["f_dname"];

            series.push({
                dbfield: df["f_dname"],
                name: df["f_label"],
                data: [],
                type: "line",
                smooth: false,
                symbol: 'none',
                // lineStyle: {
                //     color: '#00ffff'
                // },                
            })
        }

        let d0;
        for (let d of list) {
            xData.push(d[xName]);

            d0 = d;
            if (chartField.length > 0) d0 = d[chartField];

            for (let s of series) {                
                s.data.push(d0[s["dbfield"]]);
            }
        }

        //console.log(xData, series);

        let option: any = {
            grid: {
                containLabel: true,
                left: 40,
                top: 20, 
                bottom: 20,
                right: 40
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: false,
                    label: {
                        backgroundColor: '#505765'
                    }
                },
                // formatter: "{a}:{b}:{c}"
                formatter: (params: any[]) => {

                    if (params.length <= 0) return "-";

                    let dn;
                    let dataIndex;
                    var res = params[0].name + "<br/>";
                    for (let p of params) {
                        
                        res += "<span style='font-size:32px;vertical-align:middle;color:" + p.color + "'>&bull;&nbsp;</span>"
                        dataIndex = p.dataIndex;
                        var vlist = list[dataIndex][labelField];
                        //console.log(p, vlist);
                        dn = mapField[p.seriesName];
                        res += "<span style='vertical-align:middle;'>" + p.seriesName + ' : ' + vlist[dn] + '</span><br/>';
                    }
                    return res;
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xData
            },
            yAxis: {
                type: 'value'
            },
            series: series
        };

        m_chart.setOption(option);
    }

    defineExpose({
        update_data
    })    

</script>

<template>
    <div :ref="v_chart_id" :id="v_chart_id" style="width:100%;height:100%;"></div>
</template>

<style>
</style>