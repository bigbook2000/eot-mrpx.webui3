-- use framework

-- sql
select 0 as _d, '' as _s, eox_flow_process.*
    from eox_flow_process
    where _update_flag>0
    and f_data_id=#v_data_id
    and f_flow_type_id=#v_flow_type_id
    order by eox_flow_process.f_flow_process_id desc
-- end

