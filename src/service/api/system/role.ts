import { HR as request } from '@/service/request';

// 查询角色列表
export const listRole = (query: object) => request.get<Role.List>(`/system/role/list`, query);
// 查询角色详细
export const getRole = (roleId: number) => request.get<Role.SingleItem>(`/system/role/${roleId}`);
// 新增角色
export const addRole = (data: object) => request.post(`/system/role/add`, data);
// 修改角色
export const updateRole = (data: object) => request.post(`/system/role/edit`, data);
// 角色数据权限
export const dataScope = (data: object) => request.post(`/system/role/dataScope`, data);
// 角色状态修改
export const changeRoleStatus = (roleId: number, status: string) =>
  request.post(`/system/role/changeStatus`, { roleId, status });
// 删除角色
export const delRole = (roleId: number) => request.post(`/system/role/remove/${roleId}`);
// 导出角色
export const exportRole = (query: object) => request.get(`/system/role/export`, query);
// 查询角色已授权用户列表
export const allocatedUserList = (query: object) =>
  request.get<Role.HasAuthUserList>(`/system/role/authUser/allocatedList`, query);
// 查询角色未授权用户列表
export const unallocatedUserList = (query: object) =>
  request.get<Role.HasAuthUserList>(`/system/role/authUser/unallocatedList`, query);
// 取消用户授权角色
export const authUserCancel = (data: object) => request.post(`/system/role/authUser/cancel`, data);
// 批量取消用户授权角色
export const authUserCancelAll = (data: object) => request.post(`/system/role/authUser/cancelAll`, data);
// 授权用户选择
export const authUserSelectAll = (data: object) => request.post(`/system/role/authUser/selectAll`, data);
