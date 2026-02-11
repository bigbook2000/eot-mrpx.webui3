-- sql
select tcpdy.*,tkcmx.*,
    tcpdl.f_cpdl_id,tcpdl.f_dlbm,tcpdl.f_dlmc,
    tcpxl.f_cpxl_id,tcpxl.f_xlbm,tcpxl.f_xlmc
    from tkcmx,tcpdy,tcpdl,tcpxl
    where tkcmx._update_flag>0
    and f_kcbz>0
    and tkcmx.f_cpdy_id=tcpdy.f_cpdy_id
    and tcpdy.f_cpxl_id=tcpxl.f_cpxl_id
    and tcpdl.f_cpdl_id=tcpxl.f_cpdl_id

-- add > 0 #v_cpdl_id
	and tcpdl.f_cpdl_id=#v_cpdl_id
-- end

-- add > 0 #v_cpxl_id
	and tcpxl.f_cpxl_id=#v_cpxl_id
-- end

-- add <> '' #v_kcbh
	and tkcmx.f_kcbh like '%#v_kcbh%'
-- end

-- add <> '' #v_cpbm
	and tcpdy.f_cpbm like '%#v_cpbm%'
-- end

-- add <> '' #v_cpmc
	and tcpdy.f_cpmc like '%#v_cpmc%'
-- end

-- add >= 0 #v_jyzt
	and tkcmx.f_jyzt=#v_jyzt
-- end

#v_order_by

-- end