import { HR as request } from '@/service/request';

// 查询岗位列表
export const listPost = (query: object) => request.get<any>(`/system/post/list`, query);
// 查询岗位详细
export const getPost = (postId: number) => request.get(`/system/post/${postId}`);
// 新增岗位
export const addPost = (data: object) => request.post(`/system/post/add`, data);
// 修改岗位
export const updatePost = (data: object) => request.post(`/system/post/edit`, data);
// 删除岗位
export const delPost = (postId: number) => request.post(`/system/post/remove/${postId}`);
// 导出岗位
export const exportPost = (query: object) => request.get(`/system/post/export`, query);
