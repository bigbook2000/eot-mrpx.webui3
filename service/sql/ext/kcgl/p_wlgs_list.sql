-- sql
select twlgs.* from twlgs
    where twlgs._update_flag>0

-- add <> '' #v_wlgs_ids
	and twlgs.f_wlgs_ids in (#v_wlgs_ids)
-- end

    order by f_gsmc
-- end