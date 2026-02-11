---- 变更顺序

-- use framework

-- sql
update eox_flow_point set
    f_order = #v_order1,
    _update_time = ##now
    where f_flow_point_id = #v_flow_point_id1
-- end

-- sql
update eox_flow_point set
    f_order = #v_order2,
    _update_time = ##now
    where f_flow_point_id = #v_flow_point_id2
-- end

-- sql
select 0 as _d, '' as _s,
    #v_flow_point_id1 as f_flow_point_id1,
    #v_order1 as f_order1,
    #v_flow_point_id2 as f_flow_point_id2,
    #v_order2 as f_order2
-- end