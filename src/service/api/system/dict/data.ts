import { HR as request } from '@/service/request';

// 查询字典数据列表
export const listData = (query: object) => request.get<Dict.DictChildList>(`/system/dict/data/list`, query);
// 查询字典数据详细
export const getData = (dictCode: number) => request.get<Dict.DictItem>(`/system/dict/data/${dictCode}`);
// 根据字典类型查询字典数据信息
export const getDicts = (dictType: string) => request.get<Dict.DictItem[]>(`/system/dict/data/type/${dictType}`);
// 新增字典数据
export const addData = (data: object) => request.post<any>(`/system/dict/data/add`, data);
// 修改字典数据
export const updateData = (data: object) => request.post<any>(`/system/dict/data/edit`, data);
// 删除字典数据
export const delData = (dictCode: number) => request.post(`/system/dict/data/remove/${dictCode}`);
// 导出字典数据
export const exportData = (query: object) => request.get(`/system/dict/data/export`, query);
