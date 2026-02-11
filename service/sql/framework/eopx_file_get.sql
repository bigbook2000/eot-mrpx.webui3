-- use framework

---- 列出指定类型和标识的所有文件

-- sql
select eox_file.* from eox_file 
    where _update_flag>0 and f_file_id='#v_file_id';
-- end