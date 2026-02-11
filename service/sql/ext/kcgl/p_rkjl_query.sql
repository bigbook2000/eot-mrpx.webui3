---- 入库记录查询

-- sql

select tkcmxrk.*,tcpdy.*,
    tcpdl.f_cpdl_id,tcpdl.f_dlbm,tcpdl.f_dlmc,
    tcpxl.f_cpxl_id,tcpxl.f_xlbm,tcpxl.f_xlmc
    from tkcmxrk,tcpdy,tcpdl,tcpxl
    where tkcmxrk._update_flag>0
    and tkcmxrk.f_rkbz>0
    and tkcmxrk.f_cpdy_id=tcpdy.f_cpdy_id
    and tcpdy.f_cpxl_id=tcpxl.f_cpxl_id
    and tcpdl.f_cpdl_id=tcpxl.f_cpdl_id

-- add <> '' #v_kcbh
	and tkcmxrk.f_kcbh like '%#v_kcbh%'
-- end

-- add <> '' #v_cpmc
	and tcpdy.f_cpmc like '%#v_cpmc%'
-- end

-- add <> '' #v_rklb
	and tkcmxrk.f_rklb='#v_rklb'
-- end

-- add <> '' #v_kssj
    and tkcmxrk.f_rksj>='#v_kssj'
-- end
-- add <> '' #v_jssj
    and tkcmxrk.f_rksj<'#v_jssj'
-- end

#v_order_by

-- end