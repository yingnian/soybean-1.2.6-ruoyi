declare namespace Components {
  /** 搜索options配置 */
  interface SearchFormOptions {
    /** 中文名称 */
    label: string;
    /** 绑定的key，传递给后台查询时使用 */
    value: string;
    /** 默认值 */
    defaultValue?: any;
    /** 绑定key的初始化类型 - 默认为null ; daterange时间范围选择 此值应传 array,将会初始化为 [] */
    valueType?: string;
    /** 表单类型 */
    type: string;
    /** 是否由前端控制该字段的模糊查询 （原数据中台中，显示的模糊查询由前端控制 { name: '_测试_' }, 这种加**的为模糊查询） */
    fuzzyQuery?: boolean;
    /** daterange 类型的 传入两个值 这两个值为提交给后台时需要的值 */
    rangeSplit?: string[];
    /** 是否对 value 参数进行删除，默认 false 删除，当 rangeSplit 内的两个参数有一个和value相同时，不能删除（sql配置的 表格预览就是这种） */
    rangeSplitRemove?: boolean;
    /** select类型的选项值 */
    selectOptions?: any[];
    /** 自定义 label - select 自定义字段 */
    selectLabelField?: string;
    /** 自定义 value - select 自定义字段 */
    selectValueField?: string;
    /** 自定义 children - select 自定义字段 */
    selectChildrenField?: string;
    /** 是否可清除 */
    clearable?: boolean;

    /** 自定义表单用到的额外属性 */
    dict?: string;
    pidField?: string;
    hasChildField?: string;
  }

  /** 接口返回的文件实体， 一般为 FileInstance[] */
  interface FileInstance {
    absolutePath: string;
    createBy: string;
    createTime: string;
    /** 文件 Id */
    id: string;
    /** 文件名称 */
    name: string;
    /** 相对路径 一般使用此字段： 当前接口地址 + relativePath */
    relativePath: string;
    state: number;
    /** 文件类型 */
    type: string;
  }
}
