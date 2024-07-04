import { HR as request } from '@/service/request';
import { encrypt } from '@/utils/jsencrypt';

// 查询用户列表
export const listUser = (query: object) => request.get<User.List>(`/system/user/list`, query);
// 查询授权角色
export const getAuthRole = (userId: string | number) => request.get<User.GetRole>(`/system/user/authRole/${userId}`);
// 查询用户详细
export const getUser = (userId?: number) => request.get<User.getUserById>(`/system/user/${userId}`);
// 新增用户
export const addUser = (data: object | any) =>
  request.post(
    `/system/user/add`,
    Object.assign(JSON.parse(JSON.stringify(data)), {
      password: data.password === '' || data.password === undefined ? '' : encrypt(data.password)
    })
  );
// 修改用户
export const updateUser = (data: object) => request.post(`/system/user/edit`, data);
// 删除用户
export const delUser = (userId: string | number) => request.post(`/system/user/remove/${userId}`);
// 导出用户
export const exportUser = (query: object) => request.get(`/system/user/export`, query);
// 用户密码重置 默认的
export const resetUserPwd = (userId: string | number, password: string) =>
  request.post(`/system/user/resetPwd`, {
    userId,
    password: password === '' || password === undefined ? '' : encrypt(password)
  });
// 用户状态修改
export const changeUserStatus = (userId: string | number, status: string | number) =>
  request.post(`/system/user/changeStatus`, { userId, status });
// 查询用户个人信息
export const getUserProfile = () => request.get<any>(`/system/user/profile`);
// 修改用户个人信息
export const updateUserProfile = (data: object) => request.post(`/system/user/profile`, data);
// 用户密码重置
export const updateUserPwd = (oldPassword: string, newPassword: string) =>
  request.post(`/system/user/profile/updatePwd`, {
    oldPassword: encrypt(oldPassword),
    newPassword: encrypt(newPassword)
  });
// 用户头像上传
export const uploadAvatar = (data: object) => request.post<any>(`/system/user/profile/avatar`, data);
// 导入用户
export const importData = (updateSupport: string, data: object) =>
  request.post(`/system/user/importData?updateSupport=${updateSupport}`, data, {
    headers: { errorShowType: 'dialog', 'Content-Type': 'application/x-www-form-urlencoded' }
  });

// export function importData(updateSupport: string, data: any) {
//   return FlatRequest({
//     url: `/system/user/importData?updateSupport=${updateSupport}`,
//     method: 'post',
//     data,
//     headers: { errorShowType: 'dialog', 'Content-Type': 'application/x-www-form-urlencoded' }
//   });
// }

// 解除用户锁定
export const unlockTypeUp = (userId: string | number) => request.post(`/system/user/userUnlock/${userId}`);
// 保存授权角色
export const updateAuthRole = (data: object) => request.post(`/system/user/authRole`, data);
// 切换用户
export const SwitchUser = (data: string) => request.post<any>(`/login/impersonate?username=${data}`);

/** 导入用户 - 下载模板 */
export const importTemplate = () =>
  request.post(
    `/system/user/importTemplate`,
    {},
    {
      responseType: 'blob'
    }
  );
