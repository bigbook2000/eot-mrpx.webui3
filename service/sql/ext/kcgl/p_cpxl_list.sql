-- sql
select * from tcpxl where _update_flag>0

-- add >= 0 #v_cpdl_id
	and f_cpdl_id=#v_cpdl_id
-- end

order by f_cpdl_id
-- end