-- use framework

---- 更新版本

---- 这里有个特殊的转换函数
---- 具体根据数据库做定制修改

-- sql
update eox_setting 
	set f_value = cast(f_value as unsigned)+1 where f_key ='dic_version';
-- end

-- sql
select cast(f_value as unsigned) from eox_setting where f_key='dic_version';
-- end