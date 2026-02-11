
-- sql
update trkcpmx set _update_flag=-1
    where f_rkd_id=#v_cgd_id and f_rklb='#v_rklb'
-- end

-- sql
update tcgd set _update_flag=-1 where f_cgd_id=#v_cgd_id
-- end

-- sql
select #v_cgd_id as f_cgd_id;
-- end