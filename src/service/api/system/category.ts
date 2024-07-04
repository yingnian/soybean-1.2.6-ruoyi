import { HR as request } from '@/service/request';

// 列表 - 分类字典
export const listCategory = (data: object): any => request.get('/sys/category/list', data);
// 详情 - 分类字典
export const getCategory = (id: string | number): any => request.get(`/sys/category/queryById?id=${id}`);
// 新增 - 分类字典
export const addCategory = (data: object): any => request.post('/sys/category/add', data);
// 修改 - 分类字典
export const updateCategory = (data: object): any => request.post('/sys/category/edit', data);
// 删除 - 分类字典
export const delCategory = (id: number): any => request.post(`/sys/category/delete/${id}`);
// 根据 dictval 获取分类字典的节点信息
export const queryFormVal = (data: object): any => request.post(`/sys/category/queryFormVal`, data);
