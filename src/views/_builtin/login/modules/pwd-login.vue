<script setup lang="ts">
import type { FormRules } from 'naive-ui';
import { reactive } from 'vue';
import { useNaiveForm } from '@/hooks/common/form';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';
import { getCodeImg } from '@/service/api/system/login';
import { useAuthStore } from '@/store/modules/auth';

defineOptions({
  name: 'PwdLogin'
});

const authStore = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useNaiveForm();

interface FormModel {
  userName: string;
  password: string;
  imgCode: string;
  uuid: string;
}

const model: FormModel = reactive({
  userName: 'admin',
  password: 'Sdyx@0537',
  imgCode: '',
  uuid: ''
});

const rules: FormRules = {
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  imgCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
};

// 获取验证码
const imgCode = ref<string>();
async function getCodeImgFun() {
  const { data } = await getCodeImg();
  imgCode.value = `data:image/gif;base64,${data.img}`;
  model.uuid = data.uuid;
}
getCodeImgFun();

async function handleSubmit() {
  await validate();
  await authStore.login(model.userName, model.password, model.imgCode, model.uuid, true, () => {
    getCodeImgFun();
  });
}
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
    <NFormItem path="userName">
      <NInput v-model:value="model.userName" :placeholder="$t('page.login.common.userNamePlaceholder')" />
    </NFormItem>
    <NFormItem path="password">
      <NInput
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      />
    </NFormItem>
    <NFormItem path="imgCode">
      <NInput
        v-model:value="model.imgCode"
        :maxlength="6"
        placeholder="验证码,点击图片刷新"
        @keyup.enter="handleSubmit"
      />
      <div class="pl-8px">
        <img class="cursor-pointer" :src="imgCode" alt="" @click="getCodeImgFun()" />
      </div>
    </NFormItem>
    <NSpace vertical :size="24">
      <div class="flex-y-center justify-between">
        <NCheckbox>{{ $t('page.login.pwdLogin.rememberMe') }}</NCheckbox>
        <NButton quaternary @click="toggleLoginModule('reset-pwd')">
          {{ $t('page.login.pwdLogin.forgetPassword') }}
        </NButton>
      </div>
      <NButton type="primary" size="large" round block :loading="authStore.loginLoading" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </NButton>
    </NSpace>
  </NForm>
</template>

<style scoped></style>
