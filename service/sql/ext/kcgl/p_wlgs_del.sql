-- sql
update twlgs set _update_flag=-1 where f_wlgs_id=#v_wlgs_id
-- end

-- sql
select #v_wlgs_id as f_wlgs_id;
-- end