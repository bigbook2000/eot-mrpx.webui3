---- 查询零部件

-- sql

select tcpdl.f_cpdl_id,tcpdl.f_dlbm,tcpdl.f_dlmc,
    tcpxl.f_cpxl_id,tcpxl.f_xlbm,tcpxl.f_xlmc,
    tcpbj.f_cpbj_id,tcpbj.f_cpdy_pid,tcpbj.f_bjsl,
    tcpdy.*
    from tcpbj,tcpdy,tcpdl,tcpxl
    where tcpdy._update_flag>0
    and tcpdy.f_cpxl_id=tcpxl.f_cpxl_id
    and tcpdl.f_cpdl_id=tcpxl.f_cpdl_id
    and tcpbj.f_cpdy_id=tcpdy.f_cpdy_id
    and tcpbj.f_bjsl>0
    -- add > 0 #v_cpdy_pid
    and tcpbj.f_cpdy_pid=#v_cpdy_pid
    -- end

-- end