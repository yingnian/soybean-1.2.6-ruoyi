<script setup lang="ts">
import { Icon } from '@iconify/vue';
import type { TreeSelectOption } from 'naive-ui';
import { loadTreeData } from '@/service/api/online';
import { treeselect } from '@/service/api/system/dept';

/**
 * ====================================================================================================== 传入配置项 options
 * => Array 搜索表单的配置项 见 OptionsType 类型定义 hideSize => Number 多少个开始换行 默认4 (算上右侧的按钮，所以实际显示的表单数量为 hideSize - 1) length =>
 * Number 实际表单元素数量 当使用 slot 的时候 需要明确此属性
 *
 * # 支持的类型
 *
 * select 单选 date（yyyy-MM-dd） 单个日期选择 datetime（yyyy-MM-dd HH:mm:ss） 单个日期时间选择 daterange （yyyy-MM-dd） 时间范围选择 input 输入框
 * select_multi 下拉多选 sel_tree 自定义树 sel_depart 部门选择 sel_user 人员选择 pca 省市区组件 popup Popup弹框
 *
 * 外部在有默认值的情况下 初始化表格时，建议采用以下方式 <SearchForm ref="searchRef" :options="searchOptions" @reset="resetSearch"
 *
 * @search="searchTable" />
 *
 * const searchRef = ref(); nextTick(() => { searchRef.value.search(); });
 */

interface CommonObj {
  [key: string]: any;
}

// 下面的配置，如若修改 修改完成后记得修改 src/typing/global.d.ts 中的 SearchFormOptions 定义；
// （直接复制过去即可，因为目前vite不支持直接引入组件内的类型定义）
/** 搜索options配置 */
export interface OptionsType {
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

/** 搜索组件 props */
interface Props {
  /** 搜索表单的配置项 */
  options?: OptionsType[];
  /** 多少个开始换行 默认4 (算上右侧的按钮，所以实际显示的表单数量为 hideSize - 1) */
  hideSize?: number;
  /** 实际表单元素数量 当使用 slot 的时候 需要明确此属性 */
  // length?: number;
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  hideSize: 4
});

const collapsed = ref<boolean>(true);
const autoCollapsed = computed(() => props.options.length > props.hideSize - 1);
const searchOptions = ref<any>();
watch(
  () => props.options,
  val => {
    if (val && Array.isArray(val)) searchOptions.value = val;
    else if (val && typeof val === 'object' && !Array.isArray(val)) searchOptions.value = Object.values(val);
  },
  { immediate: true }
);

// 获取部门树
const treeOptions = ref<any[]>();
const getTreeList = async () => {
  const { data } = await treeselect();
  if (data) treeOptions.value = data;
};

// 生成 searchForm
const searchForm = ref<CommonObj>({});
const setFormInit = (val: OptionsType[]) => {
  const obj: CommonObj = {};
  val.forEach((k: CommonObj) => {
    switch (k.valueType) {
      case 'array':
        obj[k.value] = k.defaultValue ? k.defaultValue : null;
        break;
      case 'number':
        obj[k.value] = k.defaultValue ? k.defaultValue : 0;
        break;
      default:
        obj[k.value] = k.defaultValue ? k.defaultValue : null;
    }

    if (k.type === 'select') obj[k.value] = k.defaultValue ? k.defaultValue : null;
  });

  // 如果配置中包含部门树 则发起请求
  const hasDeptTree = val.find((i: CommonObj) => i.type === 'sel_depart') || null;
  if (hasDeptTree) getTreeList();

  return obj;
};

// 动态树 - 数据加载
const loadTreeDataFun = async (
  options: OptionsType[],
  pid: string | number,
  key: string,
  parentNode?: TreeSelectOption
) => {
  const row = options.filter(i => i.value === key)[0] || {};
  const tables = row.dict || '';
  if (!tables) return;

  const tablesAry = tables.split(',');
  const params = {
    pid: pid || 0, // 当前节点ID  首次为0
    pidField: row.pidField,
    tableName: tablesAry[0],
    text: tablesAry[1],
    code: tablesAry[2],
    hasChildField: row.hasChildField,
    condition: ''
  };
  const { data } = await loadTreeData(params);
  if (data) {
    const _ary = data.map((i: any) => ({
      label: i.title,
      key: i.key,
      depth: 1,
      isLeaf: i.leaf,
      valueKey: key
    }));

    if (!pid) {
      row.selectOptions = _ary;
    } else if (parentNode) parentNode.children = _ary;
  }
};
// 点击动态树时 动态加载节点
const handleLoad = (option: TreeSelectOption) => {
  return loadTreeDataFun(props.options, option.key as string, option.valueKey as string, option);
};

/** ======== 组件初始方法 watch ======== */
watch(
  () => props.options,
  val => {
    searchForm.value = setFormInit(val);
    if (val && val.length) loadTreeDataFun(val, 0, 'sel_tree');
  },
  { immediate: true, deep: true }
);

const setParams = (obj: any) => {
  const newObj: any = {};
  Object.keys(obj).forEach(k => {
    const _fuzzyQuery = props.options.find(m => m.value === k)?.fuzzyQuery || false;
    const _v = obj[k] ? `*${obj[k]}*` : undefined;
    newObj[k] = _fuzzyQuery ? _v : obj[k];
  });
  return newObj;
};

interface Emits {
  (e: 'reset', params: CommonObj): void;
  (e: 'searchparams', params: CommonObj): void;
  (e: 'search', params: CommonObj): void;
}
const emit = defineEmits<Emits>();
// 重置
const resetFun = () => {
  // searchForm.value = setFormInit(props.options);
  searchForm.value = Object.keys(searchForm.value).reduce((acc, key) => {
    (acc as any)[key] = null;
    return acc;
  }, {});
  const params = { ...searchForm.value };
  props.options.forEach((k: CommonObj) => {
    // 时间段的数据整合
    if (k.type === 'daterange') {
      const dateAry = k.rangeSplit;
      params[dateAry[0]] = null;
      params[dateAry[1]] = null;
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      if (!k.rangeSplitRemove) delete params[k.value];
    }
  });
  emit('search', params);
  emit('reset', params);
};

// 搜索
const searchFun = () => {
  setTimeout(() => {
    const params = { ...searchForm.value };
    props.options.forEach((k: CommonObj) => {
      // 时间段的数据整合
      if (k.type === 'daterange' && searchForm.value[k.value] && searchForm.value[k.value].length) {
        const dateAry = k.rangeSplit;
        const datarangeValue = searchForm.value[k.value];

        params[dateAry[0]] = datarangeValue[0];
        params[dateAry[1]] = datarangeValue[1];
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        if (!k.rangeSplitRemove) delete params[k.value];
      }

      // 有默认值 且 不可清除的情况下，reset 恢复默认值
      if (k.defaultValue && !k.clearable) {
        params[k.value] = k.defaultValue;
        searchForm.value[k.value] = k.defaultValue;
      }
    });

    emit('search', setParams(params));
    emit('searchparams', setParams(params));
  }, 100);
};

defineExpose({ search: searchFun, reset: resetFun });
</script>

<template>
  <NCard class="mb-3">
    <NForm inline>
      <NGrid :cols="hideSize" :x-gap="10" :y-gap="10" :collapsed="collapsed">
        <NGi v-for="(item, index) in searchOptions" :key="index">
          <NFormItem
            :show-feedback="false"
            :label="item.label"
            label-placement="left"
            :class="autoCollapsed && !collapsed ? '' : 'no-feedback'"
          >
            <NInput
              v-if="item.type == 'input'"
              v-model:value="searchForm[item.value]"
              :clearable="item.clearable === false ? false : true"
              type="text"
              @change="searchFun"
            />
            <NSelect
              v-if="item.type == 'select'"
              v-model:value="searchForm[item.value]"
              :clearable="item.clearable === false ? false : true"
              :label-field="item.selectLabelField || 'label'"
              :value-field="item.selectValueField || 'value'"
              :children-field="item.selectChildrenField || 'children'"
              :options="item.selectOptions"
              @update-value="searchFun"
            />
            <NSelect
              v-if="item.type == 'select_multi'"
              v-model:value="searchForm[item.value]"
              :clearable="item.clearable === false ? false : true"
              multiple
              :label-field="item.selectLabelField || 'label'"
              :value-field="item.selectValueField || 'value'"
              :children-field="item.selectChildrenField || 'children'"
              :options="item.selectOptions"
              @update-value="searchFun"
            />
            <NSelect
              v-if="item.type == 'select_search'"
              v-model:value="searchForm[item.value]"
              :clearable="item.clearable === false ? false : true"
              filterable
              :label-field="item.selectLabelField || 'label'"
              :value-field="item.selectValueField || 'value'"
              :children-field="item.selectChildrenField || 'children'"
              :options="item.selectOptions"
              @update-value="searchFun"
            />
            <NDatePicker
              v-if="item.type == 'date'"
              v-model:formatted-value="searchForm[item.value]"
              value-format="yyyy-MM-dd"
              type="date"
              :clearable="item.clearable === false ? false : true"
              @update-value="searchFun"
            />
            <NDatePicker
              v-if="item.type == 'dateYear'"
              v-model:formatted-value="searchForm[item.value]"
              value-format="yyyy"
              type="year"
              :clearable="item.clearable === false ? false : true"
              @update-value="searchFun"
            />
            <NDatePicker
              v-if="item.type == 'datetime'"
              v-model:formatted-value="searchForm[item.value]"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :clearable="item.clearable === false ? false : true"
              @update-value="searchFun"
            />
            <NDatePicker
              v-if="item.type == 'daterange'"
              v-model:formatted-value="searchForm[item.value]"
              close-on-select
              type="daterange"
              value-format="yyyy-MM-dd"
              :clearable="item.clearable === false ? false : true"
              @update-value="searchFun"
            />
            <NTreeSelect
              v-if="item.type == 'sel_depart'"
              v-model:value="searchForm[item.value]"
              key-field="id"
              :clearable="item.clearable === false ? false : true"
              :options="treeOptions"
              @update-value="searchFun"
            />
            <NTreeSelect
              v-if="item.type == 'sel_tree'"
              v-model:value="searchForm[item.value]"
              :options="item.selectOptions"
              :cascade="false"
              check-strategy="all"
              :show-path="true"
              :allow-checking-not-loaded="false"
              :on-load="handleLoad"
            />
          </NFormItem>
        </NGi>
        <slot name="other" :search-form="searchForm"></slot>

        <NGi suffix class="flex justify-end" :class="!collapsed ? 'mt-3' : ''">
          <NButton type="primary" @click="searchFun">查询</NButton>
          <NButton class="ml-2 mr-2" @click="resetFun">重置</NButton>
          <NButton v-if="autoCollapsed" text type="info" icon-placement="right" @click="collapsed = !collapsed">
            {{ collapsed ? '展开' : '收起' }}
            <template #icon>
              <Icon v-if="collapsed" icon="ant-design:down-outlined"></Icon>
              <Icon v-else icon="ant-design:up-outlined"></Icon>
            </template>
          </NButton>
        </NGi>
      </NGrid>
    </NForm>
  </NCard>
</template>
