-- sql
update tcgdcp set _update_flag=-1 where f_cgdcp_id=#v_cgdcp_id
-- end

-- sql
select #v_cgdcp_id as f_cgdcp_id;
-- end