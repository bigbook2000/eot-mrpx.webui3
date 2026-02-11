---- 计算总金额，并统计

-- sql

select count(*) as f_count,sum(f_cpzj) as f_cpzj
    from tkcmxck where tkcmxck._update_flag>0
    and tkcmxck.f_ckd_id=#v_ckd_id
    and tkcmxck.f_cklb='#v_cklb'

-- end