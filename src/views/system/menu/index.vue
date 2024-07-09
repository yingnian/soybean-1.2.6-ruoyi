<script lang="ts" setup>
import type { VxeColumnPropTypes, VxeTableInstance } from 'vxe-table';
// import { useRouteStore } from '@/store';
import { useElementSizeDom } from '@/hooks/business/element-resize';
import { delMenu, listMenu } from '@/service/api/system/menu';
import AddMenu from './modules/add-menu.vue';
import DataPermission from './modules/data-permission.vue';
// const route = useRouteStore();

const { height } = useElementSizeDom(120);

const searchOptions = reactive<Components.SearchFormOptions[]>([
  { label: '菜单名称', value: 'menuName', type: 'input' },
  {
    label: '状态',
    value: 'status',
    type: 'select',
    selectOptions: [
      { label: '正常', value: 0 },
      { label: '停用', value: 1 }
    ]
  }
]);

const realPathFormatter: VxeColumnPropTypes.Formatter<any> = ({ cellValue }) => {
  return cellValue ? `/${cellValue}` : '';
};
const gridOptions = reactive<any>({
  loading: false,
  showOverflow: 'tooltip',
  rowConfig: {
    useKey: true
  },
  treeConfig: {
    transform: true,
    rowField: 'menuId',
    parentField: 'parentId',
    trigger: 'cell'
  },
  columns: [
    { field: 'menuName', title: '菜单名称', treeNode: true, align: 'left' },
    { field: 'icon', title: '图标', width: 70, slots: { default: 'icon' } },
    { field: 'orderNum', title: '排序', width: 70, sortable: true },
    { field: 'perms', title: '权限标识', align: 'left' },
    { field: 'realPath', title: '自定义路由', align: 'left', formatter: realPathFormatter },
    { field: 'path', title: '组件路径', align: 'left' },
    { field: 'status', title: '状态', width: 80, slots: { default: 'status' } },
    { field: 'visible', title: '显隐', width: 80, slots: { default: 'visible' } },
    { field: 'isCache', title: '是否缓存', width: 80, slots: { default: 'isCache' } },
    { field: 'createTime', title: '创建时间' },
    { field: 'action', title: '操作', width: 260, align: 'right', fixed: 'right', slots: { default: 'action' } }
  ],
  data: [],
  toolbarConfig: {
    custom: true,
    zoom: true
  }
});

// 获取表格数据
const xTree = ref<VxeTableInstance>();
const getMenuTable = async (params?: object) => {
  gridOptions.loading = true;
  const { data } = await listMenu(params);
  gridOptions.loading = false;
  if (data) {
    gridOptions.data = data;
    // setTimeout(() => {
    //   xTree.value!.setAllTreeExpand(true);
    // });
  }
};
getMenuTable();

// 搜索/重置
const searchTable = (obj: object) => {
  getMenuTable(obj);
};

// 编辑
const parentId = ref<number>();
const addVisible = ref<boolean>(false);
const menuId = ref<number>();
const editItem = (id: number) => {
  menuId.value = id;
  addVisible.value = true;
};

// 新增
const addItem = (parentMenuId: number) => {
  addVisible.value = true;
  parentId.value = parentMenuId;
  menuId.value = 0;
};

// 删除
const deleteItem = async (id: number) => {
  const { error } = await delMenu(id);
  if (!error) {
    window.$message?.success('删除成功');
    getMenuTable();
    // route.initDynamicRoute();
  }
};

// 数据权限
const datapreVisible = ref(false);
const dataAuth = (id: number) => {
  datapreVisible.value = true;
  menuId.value = id;
};
</script>

<template>
  <div>
    <SearchForm :options="searchOptions" @search="searchTable" />

    <!-- 表格部分 -->
    <VxeGrid ref="xTree" v-bind="gridOptions" :max-height="height">
      <template #toolbar_buttons>
        <NButton v-hasPermi="['system:menu:add']" type="primary" @click="addItem(0)">新增目录</NButton>
      </template>

      <template #status="{ row }">
        <NTag v-if="row.status == 0" :bordered="false" type="success">正常</NTag>
        <NTag v-else :bordered="false" type="error">停用</NTag>
      </template>
      <template #isCache="{ row }">
        <NTag v-if="row.isCache === '0'" :bordered="false">缓存</NTag>
      </template>
      <template #visible="{ row }">
        <NTag v-if="row.visible === '1'" :bordered="false">隐藏</NTag>
      </template>
      <template #icon="{ row }">
        <div class="flex justify-center">
          <SvgIcon v-if="row.icon" class="text-20px" :local-icon="row.icon"></SvgIcon>
        </div>
      </template>
      <template #action="{ row }">
        <NButton v-hasPermi="['system:menu:edit']" quaternary type="info" size="small" @click="editItem(row.menuId)">
          修改
        </NButton>
        <NButton
          v-if="row.menuType !== 'F'"
          v-hasPermi="['system:menu:add']"
          quaternary
          type="info"
          size="small"
          @click="addItem(row.menuId)"
        >
          新增
        </NButton>
        <NPopconfirm @positive-click="deleteItem(row.menuId)">
          <template #trigger>
            <NButton v-hasPermi="['system:menu:remove']" quaternary type="error" size="small">删除</NButton>
          </template>
          确认删除 {{ row.menuName }} ？
        </NPopconfirm>
        <NButton v-if="row.menuType === 'C'" quaternary type="info" size="small" @click="dataAuth(row.menuId)">
          数据权限
        </NButton>
      </template>
    </VxeGrid>

    <!-- 新增/编辑 -->
    <AddMenu
      :id="menuId"
      :time="new Date().getTime()"
      :visible="addVisible"
      :parent-id="parentId"
      @success="getMenuTable"
      @closed="addVisible = false"
    ></AddMenu>

    <!-- 数据权限 -->
    <DataPermission :visible="datapreVisible" :menu-id="menuId" @closed="datapreVisible = false"></DataPermission>
  </div>
</template>
