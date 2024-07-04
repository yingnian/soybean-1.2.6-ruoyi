import { HR as request } from '@/service/request';

// 查询菜单列表
export const listMenu = (query?: object) => request.get<Menu.SingleItem[]>(`/system/menu/list`, query);
// 查询菜单详细
export const getMenu = (menuId: number | string) => request.get<Menu.SingleItem>(`/system/menu/${menuId}`);
// 查询菜单下拉树结构
export const treeselect = () => request.get<Menu.MenuTreeItem[]>(`/system/menu/treeSelect`);
// 角色界面查询所有数
export const treeSelectAll = () => request.get<Menu.MenuTreeItem[] | any>(`/system/menu/treeSelectAll`);
// 根据角色ID查询菜单下拉树结构
export const roleMenuTreeselect = (roleId: number | string) =>
  request.get<Menu.RoleMenu>(`/system/menu/roleMenuTreeselect/${roleId}`);
// 新增菜单
export const addMenu = (data: object) => request.post(`/system/menu/add`, data);
// 修改菜单
export const updateMenu = (data: object) => request.post(`/system/menu/edit`, data);
// 删除菜单
export const delMenu = (menuId: number | string) => request.post(`/system/menu/remove/${menuId}`);
