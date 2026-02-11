
---- 删除子类
-- sql
update tcpxl set _update_flag=-1 where f_cpxl_id=#v_cpxl_id;
-- end

-- sql
select #v_cpxl_id as f_cpxl_id;
-- end