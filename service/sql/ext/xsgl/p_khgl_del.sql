-- sql
update tcpdy set _update_flag=-1 where f_cpdy_id=#v_cpdy_id
-- end

-- sql
select #v_cpdy_id as f_cpdy_id
-- end