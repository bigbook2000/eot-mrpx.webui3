-- sql

select tkhgl.* from tkhgl where tkhgl._update_flag>0

---- 公海标识
-- add >= 0 #v_ghbz
	and tkhgl.f_ghbz=#v_ghbz
-- end

---- 潜在意向
-- add > 0 #v_qzyx
	and tkhgl.f_qzyx=#v_qzyx
-- end

---- 客户类别
-- add > 0 #v_khlb
	and tkhgl.f_khlb=#v_khlb
-- end

---- 经营状态
-- add > 0 #v_jyzt
	and tkhgl.f_jyzt=#v_jyzt
-- end

---- 经营方式
-- add > 0 #v_jyfs
	and tkhgl.f_jyfs=#v_jyfs
-- end

---- 客户来源
-- add > 0 #v_khly
	and tkhgl.f_khly=#v_khly
-- end

---- 合作等级
-- add > 0 #v_hzdj
	and tkhgl.f_hzdj=#v_hzdj
-- end

---- 公司名称
-- add <> '' #v_khmc
	and tkhgl.f_khmc like '%#v_khmc%'
-- end

---- 联系信息
-- add <> '' #v_lxxx
	and tkhgl.f_lxxx like '%#v_lxxx%'
-- end

-- end