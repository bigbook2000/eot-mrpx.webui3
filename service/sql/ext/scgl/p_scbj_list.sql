-- sql

select tscbj.*,tkcmxrk.* from tscbj,tkcmxrk
    where tscbj._update_flag>0
    and tscbj.f_sccp_id=#v_sccp_id
    and tscbj.f_kcmxrk_id=tkcmxrk.f_kcmxrk_id

-- end