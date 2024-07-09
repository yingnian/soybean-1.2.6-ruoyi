import { HR as request } from '@/service/request';

// 查询生成表数据
export const listModal = (query: object) => request.get(`/online/head/list`, query);
// 新增 保存自定义表单
export const saveModal = (data: object) => request.post(`/online/cgform/api/addAll`, data);
// 修改 保存自定义表单
export const editModal = (data: object) => request.post(`/online/cgform/api/editAll`, data);
// 获取自定义表单明细
export const getInfo = (id: number | string) => request.get<any>(`/online/cgform/api/getInfo/${id}`);
// 删除表数据
export const delModal = (id: number | string) => request.post(`/online/cgform/api/delete/${id}`);
// 生成代码（自定义路径）
export const genCode = (tableName: number | string) => request.get(`/tool/gen/genCode/${tableName}`);
// 获取数据库下拉数据源
export const getfindDbsourceList = () => request.post(`/online/head/findDbsourceList`);
// 同步表字段
export const updateField = (headIds: string) => request.get(`/online/head/refreshTable/${headIds}`);
// 移除
export const removeRecord = (id: string) => request.delete(`/online/head/removeRecord?id=${id}`);

// 导入
export const importData = (code: string, data: object) =>
  request.post(`/online/cgform/api/importXls/${code}`, data, {
    headers: { errorShowType: 'dialog' }
  });

// 导出校验
export const checkExportXls = (code: string) => request.get(`/online/cgform/api/checkExportXls/${code}`);

// 导出
export const exportData = (code: string) =>
  request.get(
    `/online/cgform/api/exportXls/${code}`,
    {},
    {
      responseType: 'blob'
    }
  );

// 同步数据库
export const synchDb = (code: number | string, synMethod: number | string) =>
  request.post(`/online/cgform/api/doDbSynch/${code}/${synMethod}`, {});

// ====== table页面接口 ====== //
// 获取查询条件
export const searchConfig = (headId: number | string) => request.get(`/online/cgform/api/getQueryInfo/${headId}`);
// 查询表格显示的columns和用来转义的字典数据
export const getTableColumnsAndDicts = (headId: number | string) =>
  request.get<any>(`/online/cgform/api/getColumns/${headId}`);
// 获取表格数据 - 普通类型的Table数据
export const getTableDataApi = (headId: number | string, params: object) =>
  request.get(`/online/cgform/api/getData/${headId}`, params);
// 树形表加载table数据 - tree类型的table数据
export const getTreeData = (headId: number | string) => request.get(`/online/cgform/api/getTreeData/${headId}`);
// 删除表单数据
export const removeForm = (headId: number | string, formId: number | string) =>
  request.post(`/online/cgform/api/form/remove/${headId}/${formId}`);

// ====== 新增/编辑 ====== //
// 获取表单渲染数据结构
export const getFormConfig = (headId: number | string) => request.get<any>(`/online/cgform/api/getFormItem/${headId}`);
// 新增时 表单保存接口
export const addForm = (headId: number | string, data: object) =>
  request.post(`/online/cgform/api/form/add/${headId}`, data);
// 编辑时 表单保存接口
export const editForm = (headId: number | string, data: object) =>
  request.post(`/online/cgform/api/form/edit/${headId}`, data);
// 获取表单详情
export const getFromDetail = (headId: number | string, id: number | string) =>
  request.get<any>(`/online/cgform/api/form/${headId}/${id}`);
// 根据用户ID查询 用户集合
export const getUserByIds = (userIds: number | string) => request.get(`/system/user/list/${userIds}`);
// 根据fileIds查询 附件集合
export const getFilesByIds = (fileIds: number | string) => request.get(`/system/files/list/${fileIds}`);
// tree数据 根据ID获取单独节点的数据 - 回显时使用
export const getSingleTreeNode = (dictCode: number | string, key: number | string) =>
  request.get(`/online/cgform/api/loadDictItem/${dictCode}?key=${key}`);

// ====== 获取字典数据 ====== //
// 加载树形数据(表名|显示字段|存储字段|pid)
export const loadTreeData = (data: object) => request.get<any>(`/online/cgform/api/loadTreeData`, data);
// 查询online级联下拉的数据项
export const querySelectOptions = (data: object) => request.get(`/online/cgform/api/querySelectOptions`, data);
// 重复校验数据
export const checkAgain = (data: object) => request.get(`/online/cgform/api/duplicate/check`, data);
// 获取字典数据
export const getDictsData = (dictCode: number | string) => request.get(`/online/cgform/api/getDictItems/${dictCode}`);

// ====== popup类型获取数据 ====== //
// 获取sql解析字段 - popup的查询字段及table的column字段
export const getSqlColumn = (sqlCode: number | string) => request.get(`/report/sql/getReportSqlColumn/by/${sqlCode}`);
// 查询报表数据列表接口 - popup的table数据
export const getSqlTableData = (sqlCode: number | string, params: object) =>
  request.get(`/report/list/by/${sqlCode}`, params);

/**
 * @returns {any}
 * @description: 导入表
 */
// 根据数据库获取数据集合
export const getFiledTable = (dbType: string) =>
  request.get(`/online/cgform/api/online/cgform/head/queryTables?dbType=${dbType}`);
// 生成表单
export const transTables = (dbtype: string, tableFields: string) =>
  request.post(`/online/head/transTables/${tableFields}`, { dbtype });
