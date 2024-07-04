import { HR as request } from '@/service/request';

// 查询字典类型列表
export const listType = (query?: object) => request.get<Dict.DictList>(`/system/dict/type/list`, query);
// 查询字典类型详细
export const getType = (dictId: number) => request.get<Dict.ListItem>(`/system/dict/type/${dictId}`);
// 新增字典类型
export const addType = (data: object) => request.post<any>(`/system/dict/type/add`, data);
// 修改字典类型
export const updateType = (data: object) => request.post<any>(`/system/dict/type/edit`, data);
// 删除字典类型
export const delType = (dictId: number) => request.post(`/system/dict/type/remove/${dictId}`);
// 刷新参数缓存
export const refreshCache = () => request.post(`/system/dict/type/refreshCache`);
// 导出字典类型
export const exportType = (query: object) => request.get(`/system/dict/type/export`, query);
// 获取字典选择框列表
export const optionselect = () => request.get<Dict.ListItem[]>(`/system/dict/type/optionselect`);
