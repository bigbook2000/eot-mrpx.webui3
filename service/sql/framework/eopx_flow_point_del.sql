-- use framework

-- sql
update eox_flow_point set _update_flag=-1 where where f_flow_point_id = #v_flow_point_id
-- end

-- sql
select 0 as _d, '' as _s, #v_flow_point_id as f_flow_point_id
-- end