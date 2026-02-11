-- sql
update #v_table set
    f_flow_point_id=#v_flow_point_id,
    f_flow_process_id=#v_flow_process_id
    where #v_id_field = #v_id_value
-- end

-- sql
select 0 as _d, '' as _s,
    #v_flow_point_id as f_flow_point_id,#v_flow_process_id as f_flow_process_id
-- end