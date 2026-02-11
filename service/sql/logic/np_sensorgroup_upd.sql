
-- iff > 0 #v_sensor_group_id
    -- sql
	update n_sensor_group set
        f_name = '#v_name',
		f_code = '#v_code',
        f_note = '#v_note',
		_update_time = ##now
		where f_sensor_group_id = #f_sensor_group_id;
	-- end
-- end

-- iff <= 0 #v_sensor_group_id
	-- inc #v_sensor_group_id
	insert into n_sensor_group(
		f_name,
        f_code,
        f_note,
		_update_time,
		_update_flag)
        values (
        '#v_name',
		'#v_code',
        '#v_note',
		##now,
		1);
	-- end
-- end

-- sql
select * from n_sensor_group where f_sensor_group_id=#v_sensor_group_id;
-- end