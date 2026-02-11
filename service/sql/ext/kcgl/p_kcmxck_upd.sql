---- 出库明细

-- iff > 0 #v_kcmxck_id
    -- sql
    update tkcmxck set
        f_cksl=#v_cksl,
        f_ckdj=#v_ckdj,
        f_ckzj=#v_ckzj,
        f_wlgs_id=#v_wlgs_id,
        f_wldh='#v_wldh',
        f_beizhu='#v_beizhu',
        _update_time=##now
        where f_kcmxck_id=#v_kcmxck_id
    -- end
-- end

-- iff <= 0 #v_kcmxck_id
    -- inc #v_kcmxck_id
    insert into tkcmxck(
        f_kcmx_id,
        f_cklb,
        f_ckd_id,
        f_kgy_id,
        f_cksl,
        f_ckdj,
        f_ckzj,
        f_wlgs_id,
        f_wldh,
        f_cksj,
        f_ckbz,
        f_beizhu,
        _update_time,
        _update_flag)
        values (
        #v_kcmx_id,
        '#v_cklb',
        #v_ckd_id,
        #v_kgy_id,
        #v_cksl,
        #v_ckdj,
        #v_ckzj,
        #v_wlgs_id,
        '#v_wldh',
        ##now,
        1,
        '#v_beizhu',
        ##now,
        1)
    -- end
-- end

---- 出库操作, 将库存有效标志设置为0
-- sql
update tkcmx set f_kcmxck_id=#v_kcmxck_id,f_kcbz=0,_update_time=##now
    where f_kcmx_id = #v_kcmx_id
-- end

-- sql
select tkcmx.*,tkcmxck.*,tcpdy.*
    from tkcmxck,tkcmx,tcpdy where tkcmxck._update_flag>0
    and tkcmxck.f_kcmx_id=tkcmx.f_kcmx_id
    and tkcmx.f_cpdy_id=tcpdy.f_cpdy_id
    and tkcmxck.f_kcmxck_id=#v_kcmxck_id
-- end