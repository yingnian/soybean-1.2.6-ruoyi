import { HR as request } from '@/service/request';

// 查询部门列表
export const listDept = (query?: object) => request.get<Dept.ListItem[]>(`/system/dept/list`, query);
// 查询部门列表（排除节点）
export const listDeptExcludeChild = (deptId: number) => request.get(`/system/dept/list/exclude/${deptId}`);
// 查询部门详细
export const getDept = (deptId: number) => request.get<Dept.ListItem>(`/system/dept/${deptId}`);
// 查询部门下拉树结构
export const treeselect = () => request.get<any>(`/system/dept/treeselect`);
// 根据角色ID查询部门树结构
export const roleDeptTreeselect = (roleId: number) =>
  request.get<Dept.TreeByRoleId>(`/system/dept/roleDeptTreeselect/${roleId}`);
// 新增部门
export const addDept = (data: object) => request.post(`/system/dept/add`, data);
// 修改部门
export const updateDept = (data: object) => request.post(`/system/dept/edit`, data);
// 删除部门
export const delDept = (deptId: number) => request.post(`/system/dept/remove/${deptId}`);

// 按部门查询全部状态正常的用户
export const getUserByDeptId = (deptId: number) =>
  request.get<{ rows: Dept.UserByDeptItem[]; total: number }>(`/system/user/listDeptAll?deptId=${deptId}`);
