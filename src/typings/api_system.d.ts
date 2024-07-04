/** 用户管理 */
declare namespace User {
  interface Dept {
    /** 部门id */
    deptId: number;
    /** 部门名称 */
    deptName: string;
    /** 部门领导人 */
    leader: string;
    children: any[];
  }

  interface ListItem {
    /** 是否是管理员 */
    admin: boolean;
    /** 头像 */
    avatar: string;
    createBy: string;
    createTime: string;
    /** 删除状态 */
    delFlag: string;
    /** 部门信息 */
    dept: Dept;
    /** 部门Id */
    deptId: number;
    /** 邮箱 */
    email: string;
    /** 锁定状态 0正常 1锁定 */
    lockType: number;
    /** 登录时间 */
    loginDate: string;
    /** 登录IP */
    loginIp: string;
    /** 昵称 */
    nickName: string;
    /** 手机号 */
    phonenumber: string;
    /** 备注 */
    remark: string;
    /** 角色信息 */
    roles: string[];
    /** 性别 0男 */
    sex: string;
    /** 启用状态 0启用 1停用 */
    status: string;
    /** 用户id */
    userId: number;
    /** 登录账号 */
    userName: string;
  }
  interface List {
    rows: ListItem[];
    total: number;
  }

  interface PostItem {
    createBy: string;
    createTime: string;
    flag: boolean;
    /** 岗位编码 */
    postCode: string;
    /** 岗位ID */
    postId: number;
    /** 岗位名称 */
    postName: string;
    postSort: string;
    remark: string;
    /** 状态（0正常 1停用） */
    status: string;
  }
  /** 根据用户id查询详情 */
  type getUserById = {
    posts: PostItem[];
    roles: Role.SingleItem[];
    postIds?: number[];
    roleIds?: number[];
    data?: ListItem;
    user: any;
  };

  interface GetRole {
    roles?: [];
    user: ListItem;
  }
}

// 角色相关信息
declare namespace Role {
  interface List {
    rows: SingleItem[];
    total: number;
  }

  /** 角色详情 */
  interface SingleItem {
    /** 是否是管理员 */
    admin: boolean;
    createTime: string;
    /** 数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限） */
    dataScope: string;
    /** 删除标志（0代表存在 2代表删除） */
    delFlag: string;
    /** 部门树选择项是否关联显示 */
    deptCheckStrictly: boolean;
    flag: boolean;
    /** 菜单树选择项是否关联显示 */
    menuCheckStrictly: boolean;
    remark: string;
    /** 角色ID */
    roleId: number;
    /** 角色字符 */
    roleKey: string;
    /** 角色名称 */
    roleName: string;
    /** 排序 */
    roleSort: string;
    /** 角色状态（0正常 1停用） */
    status: string;

    [key: string]: any;
  }

  /** 授权角色用户 */
  interface HasAuthUserList {
    rows: User.ListItem[];
    total: number;
  }
}

// 部门相关接口
declare namespace Dept {
  interface ListItem {
    /** 祖级列表 */
    ancestors: string;
    /** 子集 */
    children: any[];
    createBy: string;
    createTime: string;
    /** 删除标志（0代表存在 2代表删除） */
    delFlag: string;
    deptId: number;
    /** 部门名称 */
    deptName: string;
    email: string;
    /** 负责人 */
    leader: string;
    orderNum: number;
    /** 父级id */
    parentId: number;
    phone: string;
    /** 部门状态（0正常 1停用） */
    status: '0' | '1';
  }

  interface List {
    id: number;
    label: string;
    children?: List;
    [key: string]: any;
  }

  interface TreeByRoleId {
    depts: List;
    checkedKeys: number[];
  }

  /** 按部门查询全部状态正常的用户 */
  interface UserByDeptItem extends Pick<User.ListItem, 'admin' | 'lockType' | 'nickName' | 'userId'> {
    [key: string]: any;
  }
}

// 字典相关接口
declare namespace Dict {
  interface ListItem {
    /** 字典名称 */
    dictName: string;
    dictId: number;
    /** 字典类型 */
    dictType: string;
    /** 状态（0正常 1停用） */
    status: '0' | '1';
    remark: string;
    createTime: string;

    selected?: boolean;
    [key: string]: any;
  }

  interface DictList {
    rows: ListItem[];
  }

  interface DictChildList {
    rows: DictItem[];
  }
  interface DictItem {
    /** 字典编码 */
    dictCode: number;
    /** 字典键值 */
    dictValue: string;
    /** 字典标签 */
    dictLabel: string;
    dictSort: number;
    /** 字典类型 */
    dictType: string;
    remark: string;
    /** 状态（0正常 1停用） */
    status: '0' | '1';

    [key: string]: any;
  }
}

// 菜单
declare namespace Menu {
  interface MenuTreeItem {
    id: number;
    label: string;
    children?: [];

    [key: string]: any;
  }

  interface RoleMenu {
    checkedKeys: number[];
    menus: [];
    code: number;
    msg: string;
  }

  interface SingleItem {
    /** Tab可关闭，1/0 */
    affix: number;
    children: any[];
    /** 组件路径 */
    component: string;
    createTime: string;
    /** 图标 */
    icon: string;
    /** 是否缓存（0缓存 1不缓存） */
    isCache: '0' | '1';
    /** 是否为外链（0是 1否） */
    isFrame: '0' | '1';
    /** 菜单id */
    menuId: number;
    /** 菜单名称 */
    menuName: string;
    /** 菜单类型（M目录 C菜单 F按钮） */
    menuType: 'M' | 'C' | 'F';
    /** 排序 */
    orderNum: number;
    /** 父级菜单id */
    parentId: number;
    /** 路由地址 */
    path: string;
    /** 权限标识 */
    perms: string;
    /** 菜单状态（0正常 1停用） */
    status: '0' | '1';
    /** 菜单状态（0显示 1隐藏） */
    visible: '0' | '1';

    [key: string]: any;
  }

  interface RuleMenu {
    createBy: string;
    createTime: string;
    id: string;
    menuId: number;
    ruleColumn: string;
    ruleConditions: string;
    ruleName: string;
    ruleValue: string;
    status: string;
    [key: string]: any;
  }
}

// 日志
declare namespace Log {
  interface OperLogItem {
    operId: number;
    /** 模块标题 */
    title: string;
    /** 业务类型（0其它 1新增 2修改 3删除） */
    businessType: string;
    /** 请求方式 */
    requestMethod: string;
    /** 操作人员 */
    operName: string;
    /** ip */
    operIp: string;
    /** 操作地点 */
    operLocation: string;
    /** 操作状态（0正常 1异常） */
    status: string;
    operTime: string;
  }

  interface LoginLogItem {
    infoId: number;
    userName: string;
    ipaddr: string;
    loginLocation: string;
    browser: string;
    os: string;
    status: string;
    msg: string;
    loginTime: string;
  }
}

declare namespace Login {
  interface LoginRemember {
    userName: string;
    password: string;
    rememberMe: boolean;
  }
}

/** 数据源 */
declare namespace DataSource {
  interface ListItem {
    /** 数据源编码 */
    code: string;
    createBy: string;
    createTime: string;
    /** 驱动类 */
    dbDriver: string;
    /** 数据库名称 */
    dbName: string;
    /** 密码 */
    dbPassword: string;
    /** 数据库类型; */
    dbType: string;
    /** 数据源地址; */
    dbUrl: string;
    /** 用户名 */
    dbUsername: string;
    /** 数据库所属层级 */
    hierarchy: string;
    id: string;
    /** 数据源名称; */
    name: string;
    /** 备注 */
    remark: string;
    /** 所属部门 */
    sysOrgCode: string;
    updateBy: string;
    updateTime: string;
  }

  /** 数据源列表 */
  interface List {
    rows: ListItem[];
    total: number;
  }
}
