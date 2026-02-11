-- sql
select tgys.* from tgys where tgys._update_flag>0

-- add > 0 #v_gysdj
	and tgys.f_gysdj=#v_gysdj
-- end

-- add > 0 #v_gsgm
	and tgys.f_gsgm=#v_gsgm
-- end

-- add <> '' #v_gysmc
	and tgys.f_gysmc like '%#v_gysmc%'
-- end

-- add <> '' #v_lxr
	and tgys.f_lxr like '%#v_lxr%'
-- end

-- add <> '' #v_lxdh
	and tgys.f_lxdh like '%#v_lxdh%'
-- end

-- add <> '' #v_zycp
	and tgys.f_zycp like '%#v_zycp%'
-- end

order by f_gysmc

-- end