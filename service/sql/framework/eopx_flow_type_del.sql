-- use framework

-- sql
update eox_flow_type set _update_flag=-1 where where f_flow_type_id = #v_flow_type_id
-- end

-- sql
select 0 as _d, '' as _s, #v_flow_type_id as f_flow_type_id
-- end