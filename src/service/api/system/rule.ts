import { HR as request } from '@/service/request';

// 查询菜单数据权限规则列表
export const listRule = (query: object) => request.get<Menu.RuleMenu[]>(`/system/menu/rule/list`, query);

// 查询菜单数据权限规则详细
export const getRule = (id: string) => request.get<any>(`/system/menu/rule/${id}`);

// 新增菜单数据权限规则
export const addRule = (data: object) => request.post(`/system/menu/rule/add`, data);

// 修改菜单数据权限规则
export const updateRule = (data: object) => request.post(`/system/menu/rule/edit`, data);

// 删除菜单数据权限规则
export const delRule = (id: string) => request.post(`/system/menu/rule/remove/${id}`);

// 查询数据权限
export const listRuleSelect = (roleId: number, menuId: number) =>
  request.get<any>(`/system/role/rule/list/${roleId}/${menuId}`);

// 保存角色规则数据
export const updateRoleMenuRule = (data: object) => request.post(`/system/role/menu/edit`, data);
