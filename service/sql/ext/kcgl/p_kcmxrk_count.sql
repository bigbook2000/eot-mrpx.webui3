---- 计算总金额，并统计

-- sql

select count(*) as f_count,sum(f_cpzj) as f_cpzj
    from tkcmxrk where tkcmxrk._update_flag>0
    and tkcmxrk.f_rkd_id=#v_rkd_id
    and tkcmxrk.f_rklb='#v_rklb'

-- end