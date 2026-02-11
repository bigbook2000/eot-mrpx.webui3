
---- 先删除版本
-- sql
update n_dversion set _update_flag=-1 where f_dtype_id = #v_dtype_id;
-- end

-- sql
update n_dtype set _update_flag=-1 where f_dtype_id = #v_dtype_id;
-- end
-- sql
select 0 as _d, '' as _s, #v_dtype_id as f_dtype_id;
-- end