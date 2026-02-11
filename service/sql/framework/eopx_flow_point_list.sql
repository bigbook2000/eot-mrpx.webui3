-- use framework

-- sql
select 0 as _d, '' as _s, eox_flow_point.*
    from eox_flow_point where _update_flag>0

-- add > 0 #v_flow_type_id
	and f_flow_type_id=#v_flow_type_id
-- end

order by f_flow_type_id,f_order

-- end