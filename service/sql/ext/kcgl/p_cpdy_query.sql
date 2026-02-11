-- sql
select tcpdl.f_cpdl_id,tcpdl.f_dlbm,tcpdl.f_dlmc,
    tcpxl.f_cpxl_id,tcpxl.f_xlbm,tcpxl.f_xlmc,
    tcpdy.* from tcpdy,tcpdl,tcpxl where tcpdy._update_flag>0
    and tcpdy.f_cpxl_id=tcpxl.f_cpxl_id
    and tcpdl.f_cpdl_id=tcpxl.f_cpdl_id

-- add > 0 #v_cpdl_id
	and tcpdl.f_cpdl_id=#v_cpdl_id
-- end

-- add > 0 #v_cpxl_id
	and tcpxl.f_cpxl_id=#v_cpxl_id
-- end

-- add <> '' #v_cpbm
	and tcpdy.f_cpbm like '%#v_cpbm%'
-- end

-- add <> '' #v_cpmc
	and tcpdy.f_cpmc like '%#v_cpmc%'
-- end

order by tcpdy.f_cpbm,tcpdy.f_cpmc

-- end