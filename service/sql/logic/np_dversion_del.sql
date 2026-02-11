	
-- sql
update n_dversion set _update_flag=-1 where f_dversion_id = #v_dversion_id;
-- end

-- sql
select 0 as _d, '' as _s, #v_dversion_id as f_dversion_id;
-- end