<!--
 * @Description: 新增/编辑数据权限
 * @Author: jiansheng
 * @Date: 2023-05-08 14:11:33
-->
<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';
import { addRule, getRule, updateRule } from '@/service/api/system/rule';

interface Props {
  visible?: boolean;
  id?: string;
  menuId?: number;
  time?: number;
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  /** 编辑时使用的id */
  id: '',
  /** 菜单id */
  menuId: 0,
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
  menuId: 0,
  ruleName: '',
  ruleColumn: '',
  ruleConditions: '',
  ruleValue: '',
  status: '1'
};
const form = ref<any>({ ..._form });
const rules: FormRules = {
  ruleName: { required: true, message: '请输入名称', trigger: 'blur' },
  ruleColumn: { required: true, message: '请输入字段', trigger: 'blur' },
  ruleValue: { required: true, message: '请输入规则值', trigger: 'blur' },
  ruleConditions: { required: true, message: '请选择条件', trigger: 'change' }
};

// 编辑 - 获取详情
const getDetailFun = async (id: string) => {
  const { data } = await getRule(id);
  if (data) {
    Object.keys(data).forEach(i => {
      if (data[i] || data[i] === 0) form.value[i] = data[i];
    });
  }
};

watch(
  [() => props.id, () => props.time, () => props.visible, () => props.menuId],
  ([idVal, timeVal, visibleVal, parentIdVal]) => {
    if (idVal && timeVal && visibleVal) getDetailFun(idVal);
    if (parentIdVal || parentIdVal === 0) form.value.menuId = parentIdVal;
  }
);

// 关闭弹窗
const emit = defineEmits<{
  (e: 'closed'): void;
  (e: 'success'): void;
}>();
const closedDrawer = () => {
  form.value = { ..._form };

  emit('closed');
};

// 保存设置
const formRef = ref<FormInst | null>(null);
const loading = ref<boolean>(false);

// 新增方法
const addMenuFun = async (params: object) => {
  const { data } = await addRule(params);
  loading.value = false;
  if (data) {
    window.$message?.success('新增成功');
    closedDrawer();
    emit('success');
    emit('closed');
  }
};

// 编辑方法
const editMenuFun = async (params: object) => {
  const { data } = await updateRule(params);
  loading.value = false;
  if (data) {
    window.$message?.success('编辑成功');
    closedDrawer();
    emit('success');
    emit('closed');
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

const filterOptions = [
  { value: '=', label: '等于' },
  { value: '!=', label: '不等于' },
  { value: '>', label: '大于' },
  { value: '>=', label: '大于等于' },
  { value: '<', label: '小于' },
  { value: '<=', label: '小于等于' },
  { value: 'LEFT_LIKE', label: '以..开始' },
  { value: 'RIGHT_LIKE', label: '以..结尾' },
  { value: 'LIKE', label: '包含' },
  { value: 'IN', label: '在...中' }
];
</script>

<template>
  <NDrawer
    v-model:show="drawerVisible"
    resizable
    :default-width="500"
    :on-mask-click="closedDrawer"
    :on-esc="closedDrawer"
  >
    <NDrawerContent>
      <template #header>{{ headerTitle }}</template>

      <NForm ref="formRef" :label-width="80" label-placement="left" :model="form" :rules="rules">
        <NFormItem label="菜单id" path="menuId">
          {{ form.menuId }}
        </NFormItem>
        <NFormItem label="规则名称" path="ruleName">
          <NInput v-model:value="form.ruleName" placeholder="" maxlength="500" />
        </NFormItem>
        <NFormItem label="字段" path="ruleColumn">
          <NInput v-model:value="form.ruleColumn" placeholder="" maxlength="500" />
        </NFormItem>
        <NFormItem label="条件" path="ruleConditions">
          <NSelect v-model:value="form.ruleConditions" :options="filterOptions" />
        </NFormItem>
        <NFormItem label="规则值" path="ruleValue">
          <NInput v-model:value="form.ruleValue" placeholder="" maxlength="500" />
        </NFormItem>
        <NFormItem label="状态" path="status">
          <NRadioGroup v-model:value="form.status">
            <NRadio value="1">有效</NRadio>
            <NRadio value="0">无效</NRadio>
          </NRadioGroup>
        </NFormItem>
      </NForm>

      <template #footer>
        <NButton class="mr-2" @click="closedDrawer">取消</NButton>
        <NButton type="info" @click="saveMenu">保存</NButton>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
