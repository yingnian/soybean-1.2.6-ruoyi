<!--
 * @Description: 本地 svg，目前在 菜单新增修改的时候使用
 * @Author: jiansheng
 * @Date: 2024-03-15 15:20:31
-->
<script setup lang="ts">
interface Props {
  visible?: boolean;
  value?: string;
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  value: ''
});

const drawerVisible = ref(false);
watch(
  () => props.visible,
  val => {
    drawerVisible.value = val;
  },
  { immediate: true }
);

// 关闭
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'update:value', value: string): void;
}>();
const closeModal = () => {
  console.log('0000000');
  emit('update:visible', false);
};

const modelValue = computed({
  get() {
    return props.value;
  },
  set(val: string) {
    emit('update:value', val);
  }
});

const iconsList = ref<string[]>([]);

const clickIcon = (icon: string) => {
  emit('update:value', icon);
  closeModal();
};

/** 获取 svg-icon 下的所有 svg 名称 */
async function importAllSvgFiles() {
  const svgFileNames: string[] = [];
  const svgFiles = import.meta.glob('@/assets/svg-icon/*.svg');

  Object.keys(svgFiles).forEach(i => {
    svgFileNames.push(i.replace('/src/assets/svg-icon/', '').replace('.svg', ''));
  });
  return svgFileNames;
}

importAllSvgFiles()
  .then(svgFiles => {
    iconsList.value = svgFiles;
  })
  .catch(error => {
    console.error(error);
  });
</script>

<template>
  <NModal v-model:show="drawerVisible" :on-update-show="closeModal" :on-mask-click="closeModal" :on-esc="closeModal">
    <NCard
      title="本地现有svg"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
      class="svg-modal w-800px"
      :header-style="{ padding: '20px' }"
      :footer-style="{ padding: '20px' }"
    >
      <template #header-extra>
        <SvgIcon
          v-drag="['.n-modal', '.svg-modal .n-card-header']"
          class="cursor-pointer text-20px hover-text-blue"
          local-icon="close"
          @click="closeModal"
        ></SvgIcon>
      </template>

      <div class="max-h-60vh overflow-y-auto">
        <div class="local_icon_box grid grid-cols-14">
          <SvgIcon
            v-for="iconItem in iconsList"
            :key="iconItem"
            :class="{ 'border-primary': modelValue === iconItem }"
            :local-icon="iconItem"
            class="svg_div m-2px cursor-pointer border-1px border-#d9d9d9 p-4px text-30px hover:border-primary"
            @click="clickIcon(iconItem)"
          />
        </div>
      </div>
    </NCard>
  </NModal>
</template>

<style lang="scss" scoped>
.local_icon_box {
  .svg_div {
    ::v-deep(svg) {
      border: 0;
    }
  }
}
</style>
