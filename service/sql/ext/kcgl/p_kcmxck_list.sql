-- sql

select tkcmx.*,tkcmxck.*,tcpdy.*
    from tkcmxck,tkcmx,tcpdy where tkcmxck._update_flag>0
    and tkcmxck.f_kcmx_id=tkcmx.f_kcmx_id
    and tkcmxck.f_ckd_id=#v_ckd_id
    and tkcmxck.f_cklb='#v_cklb'
    and tkcmx.f_cpdy_id=tcpdy.f_cpdy_id

-- end