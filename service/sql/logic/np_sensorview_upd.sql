
-- iff > 0 #v_sensor_view_id
    -- sql
	update n_sensor_view set
		f_dept_id = #v_dept_id,
        f_type = '#v_type',
		f_index = #v_index,
		f_label = '#v_label',
		f_precision = #v_precision,
		f_unit = '#v_unit',
		f_order = #v_order,
		f_visible = #v_visible,
		f_params = '#v_params',
        f_note = '#v_note',
		_update_time = ##now
		where f_sensor_view_id = #v_sensor_view_id;
	-- end
-- end

-- iff <= 0 #v_sensor_view_id
	-- inc #v_sensor_view_id
	insert into n_sensor_view(
		f_dept_id,
        f_type,
		f_index,
		f_label,
		f_precision,
		f_unit,
		f_order,
		f_visible,
		f_params,
        f_note,
		_update_time,
		_update_flag)
        values (
        #v_dept_id,
        '#v_type',
		#v_index,
		'#v_label',
		#v_precision,
		'#v_unit',
		#v_order,
		#v_visible,
		'#v_params',
        '#v_note',
		##now,
		1);
	-- end
-- end

-- sql
select * from n_sensor_view where f_sensor_view_id=#v_sensor_view_id;
-- end