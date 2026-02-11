---- 计算总金额，并统计

-- sql

select count(*) as f_count,sum(f_cgzj) as f_cgzj
    from tcgdcp where tcgdcp._update_flag>0
    and tcgdcp.f_cgd_id=#v_cgd_id

-- end