import { HR as request } from '@/service/request';
import { encrypt } from '@/utils/jsencrypt';

/**
 * @param {string} username
 * @param {string} password
 * @param {string} code
 * @param {string} uuid
 * @returns {any}
 * @description: 登录
 */
export const fetchLogin = (username: string, password: string, code: string, uuid: string) =>
  request.post<any>(`/login`, {
    username: encrypt(username),
    password: password.length < 50 ? encrypt(password) : password,
    code,
    uuid
  });

/** 验证码 */
export const getCodeImg = () => request.get<any>('/captchaImage');

/** 获取用户信息 */
export const fetchGetUserInfo = () => request.get<any>('/getInfo');

/** 获取路由 */
export const fetchGetUserRoutes = () => request.get<any>(`/getRouters`);
