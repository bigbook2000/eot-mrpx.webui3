---- 计算总金额，并统计

-- sql

select count(*) as f_count,sum(f_xszj) as f_xszj
    from txsdcp where txsdcp._update_flag>0
    and txsdcp.f_xsd_id=#v_xsd_id

-- end