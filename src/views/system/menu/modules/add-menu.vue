<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';
import { cloneDeep } from 'lodash-es';
// import { useRouteStore } from '@/store';
import { addMenu, getMenu, treeselect, updateMenu } from '@/service/api/system/menu';

interface Props {
  visible?: boolean;
  id?: number | string;
  parentId?: number;
  time?: number;
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  id: '',
  parentId: 0,
  time: 0
});

const drawerVisible = ref(false);
watch(
  () => props.visible,
  val => {
    drawerVisible.value = val;
  },
  { immediate: true }
);
const headerTitle = computed(() => (props.id ? '编辑' : '新增'));

const _form = {
  menuName: '',
  orderNum: 0,
  menuType: 'M',
  parentId: 0,
  path: '',
  realPath: '',
  component: 'base',
  perms: '',
  isCache: '0',
  isFrame: '1',
  visible: '0',
  status: '0',
  icon: '',
  targetUrl: '',
  activeMenu: '',
  affix: 1,
  isCustomnRoute: false,
  i18nKey: '',
  multiTab: false,
  query: [],
  buttons: []
};
const form = ref<any>({ ..._form });
const rules: FormRules = {
  menuName: { required: true, message: '请输入名称', trigger: 'blur' },
  path: { required: true, message: '请输入组件目录', trigger: 'blur' },
  targetUrl: { required: true, message: '请输入外链地址', trigger: 'blur' }
};

// 父级菜单选择
const treeOptions = ref<any[]>();
const expandedOneLevel = ref<number[]>();
const getTreeList = async () => {
  const { data } = await treeselect();
  treeOptions.value = [{ id: 0, label: '主类目', children: data }];
  expandedOneLevel.value = [0];
};

// 父级菜单 - 树形节点选择
const selectTreeNode = (value: number) => {
  form.value.parentId = value;
};

/** query的分割 */
function parseQueryString(queryString: string) {
  if (!queryString || !queryString.startsWith('?')) {
    return [];
  }
  const paramsArray = queryString.slice(1).split('&');
  const result = paramsArray.map(param => {
    const [key, value] = param.split('=');
    return { key: decodeURIComponent(key), value: decodeURIComponent(value) };
  });

  return result;
}

const originDetail = ref<Menu.SingleItem>();
/** 编辑 - 获取详情 */
const getMenuFun = async (id: number | string) => {
  const { data } = await getMenu(id);
  if (data) {
    originDetail.value = { ...data };
    Object.keys(data).forEach(i => {
      if (data[i]) form.value[i] = data[i];
    });
    form.value.orderNum = Number(data.orderNum);
    form.value.query = parseQueryString(data.query);
  }
};

watch(
  [() => props.id, () => props.time, () => props.visible, () => props.parentId],
  ([idVal, timeVal, visibleVal, parentIdVal]) => {
    if (visibleVal) getTreeList();
    if (idVal && timeVal && visibleVal) getMenuFun(idVal);
    if (parentIdVal || parentIdVal === 0) form.value.parentId = parentIdVal;
  }
);

/** 修改菜单类型 */
const menuTypeChange = (val: string) => {
  if (props.id) {
    const originParentId = originDetail.value ? originDetail.value.parentId : 0;
    form.value.parentId = val === 'M' ? 0 : originParentId;
  }
};

const emit = defineEmits<{
  (e: 'closed'): void;
  (e: 'success'): void;
}>();
const closedDrawer = () => {
  form.value = { ..._form };
  originDetail.value = undefined;
  emit('closed');
};

// 保存设置
const formRef = ref<FormInst | null>(null);
const loading = ref<boolean>(false);

// const route = useRouteStore();

/** query保存处置 */
function setQueryString(params: { key: string; value: string }[]) {
  if (!Array.isArray(params) || !params.length) {
    return '';
  }

  const queryString = params
    .map(param => {
      const encodedKey = encodeURIComponent(param.key);
      const encodedValue = encodeURIComponent(param.value);
      return `${encodedKey}=${encodedValue}`;
    })
    .join('&');

  return `?${queryString}`;
}

/** 新增方法 */
const addMenuFun = async (params: any) => {
  params.perms = params.perms.trim();
  const { data } = await addMenu(params);
  loading.value = false;
  if (data) {
    window.$message?.success('新增成功');
    closedDrawer();
    // route.initDynamicRoute();
    emit('success');
  }
};

/** 编辑方法 */
const editMenuFun = async (params: any) => {
  params.perms = params.perms.trim();
  const { data } = await updateMenu(params);
  loading.value = false;
  if (data) {
    window.$message?.success('编辑成功');
    closedDrawer();
    // route.initDynamicRoute();
    emit('success');
  }
};

const saveMenu = () => {
  formRef.value?.validate(err => {
    if (!err) {
      loading.value = true;
      const params = cloneDeep(form.value);
      params.buttons = null;
      params.query = setQueryString(form.value.query);

      if (props.id) {
        editMenuFun(params);
      } else {
        addMenuFun(params);
      }
    }
  });
};

const iconSelectVisible = ref(false);
const openIconDialog = () => {
  iconSelectVisible.value = true;
};

const routePathChange = (val: string) => {
  form.value.i18nKey = `route.${val}`;
};
</script>

<template>
  <NDrawer
    v-model:show="drawerVisible"
    resizable
    :default-width="600"
    :on-mask-click="closedDrawer"
    :on-esc="closedDrawer"
  >
    <NDrawerContent>
      <template #header>{{ headerTitle }}</template>

      <NForm ref="formRef" :label-width="120" label-placement="left" :model="form" :rules="rules">
        <NFormItem label="父级" path="parentId">
          <NTreeSelect
            v-model:value="form.parentId"
            key-field="id"
            :options="treeOptions"
            :virtual-scroll="false"
            :default-value="form.parentId"
            :default-expanded-keys="expandedOneLevel"
            @update:value="selectTreeNode"
          />
        </NFormItem>
        <NFormItem label="类别">
          <NRadioGroup v-model:value="form.menuType" @update-value="menuTypeChange">
            <NRadio value="M">目录</NRadio>
            <NRadio value="C">菜单</NRadio>
          </NRadioGroup>
        </NFormItem>
        <NFormItem label="菜单名称" path="menuName">
          <NInput v-model:value="form.menuName" placeholder="" maxlength="20" />
        </NFormItem>
        <NFormItem label="布局" path="component">
          <NRadioGroup v-model:value="form.component">
            <NRadio value="base">项目布局</NRadio>
            <NRadio value="blank">空白布局</NRadio>
          </NRadioGroup>
        </NFormItem>
        <!--
 <NFormItem v-if="form.menuType === 'C'" label="自定义路由">
          <NRadioGroup v-model:value="form.isCustomnRoute">
            <NRadio :value="true">是</NRadio>
            <NRadio :value="false">否</NRadio>
          </NRadioGroup>
        </NFormItem>
-->
        <NFormItem label="组件路径" path="path">
          <NInput v-model:value="form.path" placeholder="" maxlength="100" @update:value="routePathChange" />
        </NFormItem>
        <NFormItem path="i18nKey">
          <template #label>
            <NPopover trigger="hover">
              <template #trigger>
                <div class="flex items-center justify-end">
                  国际化key
                  <SvgIcon class="ml-0.5 text-lg color-gray" local-icon="notice-icon"></SvgIcon>
                </div>
              </template>
              <div>如果设置，将用于i18n，此时【菜单名称】将被忽略</div>
            </NPopover>
          </template>
          <NInput v-model:value="form.i18nKey" placeholder="" maxlength="100" />
        </NFormItem>
        <NFormItem label="排序" path="orderNum">
          <NInputNumber v-model:value="form.orderNum" :precision="0" :max="9999" :min="0" />
        </NFormItem>
        <NFormItem v-if="form.menuType != 'M'" label="权限标识" path="perms">
          <NInput v-model:value="form.perms" placeholder="" maxlength="100" />
        </NFormItem>
        <NFormItem label="显示图标">
          <NInput v-model:value="form.icon" readonly placeholder="点击选择图标" @click="openIconDialog">
            <template #suffix>
              <SvgIcon :local-icon="form.icon" class="p-5px text-30px" />
            </template>
          </NInput>
        </NFormItem>
        <NFormItem v-if="form.menuType === 'C'" label="路由参数">
          <NDynamicInput v-model:value="form.query" preset="pair" key-placeholder="key" value-placeholder="value" />
        </NFormItem>
        <NFormItem label="按钮">
          <NDynamicInput
            v-model:value="form.buttons"
            preset="pair"
            key-placeholder="按钮名称"
            value-placeholder="权限标识"
          />
        </NFormItem>
        <NFormItem v-if="form.menuType === 'C'" label="新页面打开">
          <NRadioGroup v-model:value="form.isFrame">
            <NRadio value="0">是</NRadio>
            <NRadio value="1">否</NRadio>
          </NRadioGroup>
        </NFormItem>
        <NFormItem v-if="form.menuType === 'C'">
          <template #label>
            <NPopover trigger="hover">
              <template #trigger>
                <div class="flex items-center justify-end">
                  多页签
                  <SvgIcon class="ml-0.5 text-lg color-gray" local-icon="notice-icon"></SvgIcon>
                </div>
              </template>
              <div>默认情况下，相同路径的路由会共享一个标签页，若设置为true，则使用多个标签页</div>
            </NPopover>
          </template>
          <NRadioGroup v-model:value="form.multiTab">
            <NRadio :value="true">是</NRadio>
            <NRadio :value="false">否</NRadio>
          </NRadioGroup>
        </NFormItem>
        <NFormItem label="显示状态">
          <NRadioGroup v-model:value="form.visible">
            <NRadio value="0">显示</NRadio>
            <NRadio value="1">隐藏</NRadio>
          </NRadioGroup>
        </NFormItem>
        <NFormItem v-if="form.visible == '1'" label="高亮菜单">
          <NInput v-model:value="form.activeMenu" placeholder="菜单路由名称，eg: 'tool_gen'" maxlength="100" />
        </NFormItem>
        <NFormItem v-if="form.menuType != 'F'" label="菜单状态">
          <NRadioGroup v-model:value="form.status">
            <NRadio value="0">正常</NRadio>
            <NRadio value="1">停用</NRadio>
          </NRadioGroup>
        </NFormItem>
        <NFormItem v-if="form.menuType == 'C'" label="是否缓存" path="isCache">
          <NRadioGroup v-model:value="form.isCache">
            <NRadio value="0">是</NRadio>
            <NRadio value="1">否</NRadio>
          </NRadioGroup>
        </NFormItem>
        <NFormItem v-if="form.menuType == 'C'" label="tab可关闭">
          <NRadioGroup v-model:value="form.affix">
            <NRadio :value="1">是</NRadio>
            <NRadio :value="0">否</NRadio>
          </NRadioGroup>
        </NFormItem>
      </NForm>

      <LocalIcon v-model:visible="iconSelectVisible" v-model:value="form.icon"></LocalIcon>

      <template #footer>
        <NButton class="mr-2" @click="closedDrawer">取消</NButton>
        <NButton type="info" :loading="loading" :disabled="loading" @click="saveMenu">保存</NButton>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style lang="scss" scoped>
.menu_notice_box {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #d3d3d3;
}
</style>
