-- sql
select tcpdl.f_cpdl_id,tcpdl.f_dlbm,tcpdl.f_dlmc,
    tcpxl.f_cpxl_id,tcpxl.f_xlbm,tcpxl.f_xlmc,
    tcpdy.*,
    tsccp.*
    from tcpdy,tcpdl,tcpxl,tsccp
    where tsccp._update_flag>0
    and tcpdy.f_cpdy_id=tsccp.f_cpdy_id
    and tcpdy.f_cpxl_id=tcpxl.f_cpxl_id
    and tcpdl.f_cpdl_id=tcpxl.f_cpdl_id

-- add <> '' #v_cpbm
	and tcpdy.f_cpbm like '%#v_cpbm%'
-- end

-- add <> '' #v_cpmc
	and tcpdy.f_cpmc like '%#v_cpmc%'
-- end

-- add > 0 #v_scy_id
	and tsccp.f_scy_id=#v_scy_id
-- end

-- add <> '' #v_kssj
	and tsccp.f_jhsj>='#v_kssj'
-- end
-- add <> '' #v_jssj
	and tsccp.f_jhsj<'#v_jssj'
-- end

order by tsccp.f_sccp_id desc

-- end