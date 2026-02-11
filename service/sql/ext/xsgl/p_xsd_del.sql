
-- sql
update tkcmxrk set _update_flag=-1
    where f_rkd_id=#v_cgd_id and f_rklb='#v_rklb'
-- end

-- sql
update txsd set _update_flag=-1 where f_xsd_id=#v_xsd_id
-- end

-- sql
select #v_xsd_id as f_xsd_id;
-- end