import { nextTick, onMounted, ref, watch } from 'vue';
import { useElementSize } from '@vueuse/core';

/**
 * 使用方式
 *
 * import { useElementSizeDom } from '@/hooks'; const { height } = useElementSizeDom(122);
 *
 *     height 即可在其他地方使用
 */

/**
 * @param {number} distance 传入此值 会在原有高度上减去 distance
 * @param {string} className 监听的dom元素的 class
 * @returns {number} 变化的高度
 * @description:
 */
export function useElementSizeDom(distance = 0, className = '') {
  const height = ref();
  const domClass = className || '.content_body_container';
  onMounted(() => {
    nextTick(() => {
      height.value = document.querySelector(domClass)!.getBoundingClientRect().height - distance;
    });
  });

  const size = reactive(useElementSize(document.body, { width: 0, height: 0 }, { box: 'border-box' }));
  watch(
    () => size.height,
    () => {
      height.value = document.querySelector(domClass)!.getBoundingClientRect().height - distance;
    }
  );

  return {
    height
  };
}
