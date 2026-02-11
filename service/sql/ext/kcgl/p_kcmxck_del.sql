
---- 回退出货，将出库记录删除，并将库存记录恢复

-- sql
update tkcmxck set _update_flag=-1 where f_kcmxck_id=#v_kcmxck_id
-- end

-- sql
update tkcmx set f_kcbz=1,f_kcmxck_id=0 where f_kcmx_id=#v_kcmx_id
-- end

-- sql
select #v_kcmxck_id as f_kcmxck_id,#v_kcmx_id as f_kcmx_id
-- end