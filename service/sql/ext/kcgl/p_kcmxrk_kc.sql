
---- 查询入库编号对应的库存信息

-- sql
select * from tkcmx where f_kcmxrk_id in (#v_kcmxrk_ids) and _update_flag>0
-- end