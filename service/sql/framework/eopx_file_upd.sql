-- use framework

---- 文件只能增加，不能修改    

-- inc #t_file_id
insert into eox_file(
	f_type,
    f_keyid,
	f_index,
	f_name,        
	f_ext,
    f_total,
	f_sign,
	f_note,
    f_ctime,
    f_dtime,
	_update_time,
	_update_flag)
	values(
    '#v_type',
    #v_keyid,
	#v_index,
	'#v_name',
	'#v_ext',
    #v_total,
	'#v_sign',
	'#v_note',
    ##now,
    ##now,
    ##now, 1);
-- end

-- sql
select 0 as _d, '' AS _s, eox_file.* from eox_file where f_file_id=#t_file_id;
-- end