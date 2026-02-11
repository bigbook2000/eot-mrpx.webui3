-- sql
update #v_table set f_seek=f_seek+1 where #v_id_field=#v_id_value
-- end

-- sql
select f_seek from #v_table where #v_id_field=#v_id_value
-- end