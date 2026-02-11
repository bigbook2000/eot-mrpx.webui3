
---- 删除子类
-- sql
update tcpxl set _update_flag=-1 where f_cpdl_id=#v_cplb_id;
-- end

-- sql
update tcpdl set _update_flag=-1 where f_cplb_id=#v_cplb_id;
-- end

-- sql
select #v_cpdl_id as f_cpdl_id;
-- end