<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';
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
  component: 'basic',
  perms: '',
  isCache: '0',
  isFrame: '1',
  visible: '0',
  status: '0',
  icon: '',
  targetUrl: '',
  activeMenu: '',
  affix: 1,
  singleLayout: ''
};
const form = ref<any>({ ..._form });
const rules: FormRules = {
  menuName: { required: true, message: '请输入名称', trigger: 'blur' },
  path: { required: true, message: '请输入组件目录', trigger: 'blur' },
  targetUrl: { required: true, message: '请输入外链地址', trigger: 'blur' }
};

const showName = computed(() => {
  let _name = '';
  switch (form.value.menuType) {
    case 'M':
      _name = '目录名称';
      break;
    case 'C':
      _name = '菜单名称';
      break;
    case 'F':
      _name = '按钮名称';
      break;
    default:
  }
  return _name;
});

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

// 编辑 - 获取详情
const originDetail = ref<Menu.SingleItem>();
const getMenuFun = async (id: number | string) => {
  const { data } = await getMenu(id);
  if (data) {
    originDetail.value = { ...data };
    Object.keys(data).forEach(i => {
      if (data[i]) form.value[i] = data[i];
    });
    form.value.orderNum = Number(data.orderNum);
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

// 修改菜单类型
const menuTypeChange = (val: string) => {
  if (props.id) {
    const originParentId = originDetail.value ? originDetail.value.parentId : 0;
    form.value.parentId = val === 'M' ? 0 : originParentId;
  }
};

// 关闭弹窗
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

// 新增方法
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

// 编辑方法
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
      if (props.id) {
        editMenuFun(form.value);
      } else {
        addMenuFun(form.value);
      }
    } else {
      console.log(err);
    }
  });
};

const iconSelectVisible = ref(false);
const openIconDialog = () => {
  iconSelectVisible.value = true;
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
        <NFormItem label="上级菜单" path="parentId">
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
            <NRadio value="F">按钮</NRadio>
          </NRadioGroup>
        </NFormItem>
        <NFormItem :label="showName" path="menuName">
          <NInput v-model:value="form.menuName" placeholder="" maxlength="20" />
        </NFormItem>
        <NFormItem v-if="form.menuType != 'F'" path="path">
          <template v-if="form.menuType === 'C'" #label>
            <NPopover trigger="hover">
              <template #trigger>
                <div class="flex items-center justify-end">
                  {{ form.component === 'iframe' ? 'iframe地址' : '文件夹名称' }}
                  <SvgIcon class="ml-0.5 text-lg color-gray" local-icon="notice-icon"></SvgIcon>
                </div>
              </template>
              <div>
                <p>1. 在没有使用自定义路由的时候，只写其文件夹名称即可；eg: demo</p>

                <p class="mt-2 color-red font-bold">使用了自定义路由时：</p>
                <p>2. 如果不需要变更父级菜单，则与（1）相同 eg: demo</p>
                <p>
                  3. 如果需要变更父级菜单，则需要将其原目录标明（写上其真实的文件目录），格式为
                  [test]demo，[]内为其父级；如果文件层级超过2层，[test_demo]menu []中间的文件夹名称以_连接即可
                </p>
                <p>为iframe地址时，请填写完整的可访问地址（直接在浏览器能打开的那种）</p>
              </div>
            </NPopover>
          </template>
          <template v-else #label>文件夹名称</template>
          <NInput v-model:value="form.path" placeholder="" maxlength="100" />
        </NFormItem>
        <NFormItem v-if="form.menuType === 'C' && form.component === 'self'" label="自定义路由" path="realPath">
          <template #label>
            <NPopover trigger="hover">
              <template #trigger>
                <div class="flex items-center justify-end">
                  自定义路由
                  <SvgIcon class="ml-0.5 text-lg color-gray" local-icon="notice-icon"></SvgIcon>
                </div>
              </template>
              <div>
                <p>不填写时，将取组件路径（父文件夹名称 + 当前文件夹名称）</p>
                <p>填写时，将取当前填写的字符 eg: ssss（不需要写 '/'，全局唯一 ）</p>
              </div>
            </NPopover>
          </template>
          <NInput v-model:value="form.realPath" placeholder="不填写时将取其父组件与当前组件的组合" maxlength="100" />
        </NFormItem>
        <NFormItem label="排序" path="orderNum">
          <NInputNumber v-model:value="form.orderNum" :precision="0" :max="9999" :min="0" />
        </NFormItem>
        <NFormItem v-if="form.menuType != 'M'" label="权限标识" path="perms">
          <NInput v-model:value="form.perms" placeholder="" maxlength="100" />
        </NFormItem>
        <NFormItem v-if="form.menuType != 'F'" path="component">
          <template #label>
            <NPopover trigger="hover">
              <template #trigger>
                <div class="flex items-center justify-end">
                  页面类型
                  <SvgIcon class="ml-0.5 text-lg color-gray" local-icon="notice-icon"></SvgIcon>
                </div>
              </template>
              <div class="mb-2 text-sm">
                <p class="mb-2 font-bold">注意：</p>
                <div>
                  <p class="mb-2">1. 一级目录：具有公共部分的布局【 一般用在 目录层级 eg: 系统管理 】</p>
                  <p class="mb-2">
                    2. 中间目录：【 三级路由或三级以上时，除第一级路由和最后一级路由，其余的采用该布局 eg: 日志管理 】
                  </p>
                  <p>3. 常规页面：作为子路由，使用自身的布局【一般作为最后一级路由，没有子路由时使用 eg: 菜单管理】</p>
                  <p>4. iframe：页面内打开 iframe，此时请填写上面的iframe地址</p>
                </div>
              </div>
            </NPopover>
          </template>
          <NRadioGroup v-model:value="form.component">
            <NRadio v-if="form.menuType === 'M'" value="basic">一级目录</NRadio>
            <NRadio v-if="form.menuType === 'M'" value="multi">中间目录</NRadio>
            <NRadio v-if="form.menuType === 'C'" value="self">常规页面</NRadio>
            <NRadio v-if="form.menuType === 'C'" value="iframe">iframe</NRadio>
          </NRadioGroup>
        </NFormItem>
        <NFormItem v-if="form.menuType === 'C'">
          <template #label>
            <NPopover trigger="hover">
              <template #trigger>
                <div class="flex items-center justify-end">
                  使用项目布局
                  <SvgIcon class="ml-0.5 text-lg color-gray" local-icon="notice-icon"></SvgIcon>
                </div>
              </template>
              <div>
                <p>项目布局指的是：带有 左侧sider/顶部header等</p>
                <p>如果不使用的话，则直接展示该页面</p>
              </div>
            </NPopover>
          </template>
          <NRadioGroup v-model:value="form.singleLayout">
            <NRadio value="">是</NRadio>
            <NRadio value="blank">否</NRadio>
          </NRadioGroup>
        </NFormItem>
        <NFormItem v-if="form.menuType != 'F'" label="显示图标">
          <NInput v-model:value="form.icon" readonly placeholder="点击选择图标" @click="openIconDialog">
            <template #suffix>
              <SvgIcon :local-icon="form.icon" class="p-5px text-30px" />
            </template>
          </NInput>
        </NFormItem>
        <NFormItem v-if="form.menuType === 'C'" label="是否新页面打开">
          <NRadioGroup v-model:value="form.isFrame">
            <NRadio value="0">是</NRadio>
            <NRadio value="1">否</NRadio>
          </NRadioGroup>
        </NFormItem>
        <NFormItem v-if="form.menuType != 'F'" label="显示状态">
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
        <NFormItem v-if="form.menuType == 'C'" label="是否缓存" path="menuName">
          <NRadioGroup v-model:value="form.isCache">
            <NRadio value="0">缓存</NRadio>
            <NRadio value="1">不缓存</NRadio>
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
