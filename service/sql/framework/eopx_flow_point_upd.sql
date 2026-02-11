-- use framework

-- iff > 0 #v_flow_point_id

	-- sql
	update eox_flow_point set
	    f_flow_type_id = #v_flow_type_id,
		f_name = '#v_name',
		f_role = '#v_role',
		f_order = #v_order,
		f_title = '#v_title',
		f_text = '#v_text',
		_update_time = ##now
		where f_flow_point_id = #v_flow_point_id
	-- end

-- end

-- iff <= 0 #v_flow_point_id

	---- 自增变量
	-- inc #v_flow_point_id
	insert into eox_flow_point(
	    f_flow_type_id,
		f_name,
		f_role,
		f_order,
		f_title,
		f_text,
		_update_time,
		_update_flag)
        values (
         #v_flow_type_id,
		'#v_name',
		'#v_role',
		#v_order,
		'#v_title',
		'#v_text',
		##now,
		1)
	-- end

-- end

-- sql
select eox_flow_point.* from eox_flow_point where f_flow_point_id = #v_flow_point_id
-- end

