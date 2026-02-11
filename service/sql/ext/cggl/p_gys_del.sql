-- sql
update tgys set _update_flag=-1 where f_gys_id=#v_gys_id
-- end

-- sql
select #v_gys_id as f_gys_id;
-- end