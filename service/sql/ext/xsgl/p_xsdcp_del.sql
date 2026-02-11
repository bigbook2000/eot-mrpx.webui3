

-- sql
update txsdcp set _update_flag=-1 where f_xsdcp_id=#v_xsdcp_id
-- end

-- sql
select #v_xsdcp_id as f_xsdcp_id;
-- end