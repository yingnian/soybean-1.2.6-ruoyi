<!--
 * @Description:数据权限 列表
 * @Author: jiansheng
 * @Date: 2023-05-08 13:41:21
-->
<script setup lang="ts">
import { delRule, listRule } from '@/service/api/system/rule';
import AddDataRule from './add-data-rule.vue';

interface Props {
  visible?: boolean;
  menuId?: number;
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  menuId: 0
});

const drawerVisible = ref(false);
watch(
  () => props.visible,
  val => {
    drawerVisible.value = val;
  },
  { immediate: true }
);
const addOrEditVisible = ref(false);

// 搜索
const searchOptions = reactive<Components.SearchFormOptions[]>([
  {
    label: '名称',
    value: 'ruleName',
    type: 'input'
  },
  {
    label: '规则值',
    value: 'ruleValue',
    type: 'input'
  }
]);

let searchParams = reactive<any>({});
const gridOptions = reactive<any>({
  loading: false,
  showOverflow: 'tooltip',
  columns: [
    { field: 'ruleName', title: '规则名称' },
    { field: 'ruleColumn', title: '字段' },
    { field: 'ruleConditions', title: '条件' },
    { field: 'ruleValue', title: '规则值' },
    { field: 'status', title: '状态', slots: { default: 'status' } },
    { field: 'action', title: '操作', width: 120, fixed: 'right', slots: { default: 'action' } }
  ],
  data: [],
  toolbarConfig: {
    custom: true,
    zoom: true
  }
});

const getTableList = async () => {
  gridOptions.loading = true;
  const { data } = await listRule(searchParams);
  gridOptions.loading = false;
  if (data) {
    gridOptions.data = data;
  }
};

const searchTable = (params?: object) => {
  searchParams.pageSize = 10;
  searchParams.pageNum = 1;
  searchParams = { ...searchParams, ...params };
  getTableList();
};

watch([() => props.menuId, () => props.visible], ([idVal, visibleVal]) => {
  if (idVal && visibleVal) {
    searchParams = { ...searchParams, menuId: idVal };
    getTableList();
  }
});

// 删除
const deleteItem = async (id: string) => {
  const { error } = await delRule(id);
  if (!error) {
    window.$message?.success('删除成功');
    getTableList();
  }
};
// 编辑
const ruleId = ref('');
const editItem = (id: string) => {
  addOrEditVisible.value = true;
  ruleId.value = id;
};
const closeAddDialog = () => {
  addOrEditVisible.value = false;
  ruleId.value = '';
};

// 关闭弹窗
const emit = defineEmits<{
  (e: 'closed'): void;
}>();
const closedDrawer = () => {
  emit('closed');
};
</script>

<template>
  <NDrawer
    v-model:show="drawerVisible"
    resizable
    :default-width="800"
    :on-mask-click="closedDrawer"
    :on-esc="closedDrawer"
  >
    <NDrawerContent>
      <template #header>数据权限</template>

      <SearchForm :options="searchOptions" @search="searchTable" />
      <VxeGrid v-bind="gridOptions">
        <template #toolbar_buttons>
          <NButton v-hasPermi="['system:post:add']" type="primary" @click="addOrEditVisible = true">新增</NButton>
        </template>
        <template #status="{ row }">
          <NTag v-if="row.status === '1'" :bordered="false" type="success">有效</NTag>
          <NTag v-else :bordered="false" type="error">无效</NTag>
        </template>
        <template #action="{ row }">
          <NButton quaternary type="info" size="small" @click="editItem(row.id)">修改</NButton>
          <NPopconfirm @positive-click="deleteItem(row.id)">
            <template #trigger>
              <NButton quaternary type="error" size="small">删除</NButton>
            </template>
            确认删除 {{ row.menuName }} ？
          </NPopconfirm>
        </template>
      </VxeGrid>
      <!-- 新增/编辑 -->
      <AddDataRule
        :id="ruleId"
        :visible="addOrEditVisible"
        :menu-id="menuId"
        :time="new Date().getTime()"
        @closed="closeAddDialog"
        @success="searchTable"
      ></AddDataRule>

      <template #footer>
        <NButton class="mr-2" @click="closedDrawer">关闭</NButton>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
