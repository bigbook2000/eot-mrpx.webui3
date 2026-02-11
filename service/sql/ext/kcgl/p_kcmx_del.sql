-- sql
update tkcmx set _update_flag=-1 where f_kcmx_id=#v_kcmx_id
-- end

-- sql
select #v_kcmx_id as f_kcmx_id
-- end