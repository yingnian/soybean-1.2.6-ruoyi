import type { App, Directive, DirectiveBinding } from 'vue';

/**
 * @description: 水印指令
 * 支持传递3个文本，竖向排列
 * v-watermark="{ text1: '张三', text2: new Date().getTime(), text3: 'AI输出内容仅供参考' }"
 */
export default function setupWaterDirective(app: App) {
  const watermarkDirective: Directive<HTMLElement, boolean | undefined> = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      const { text1, text2, text3 } = binding.value;
      const font = '14px Microsoft JhengHei';
      const textColor = 'rgba(192, 192, 192, 0.2)';
      // 根据两个文字的长度设置每一个模块的长度
      const width = 260;
      const height = 160;
      // 倾斜角度
      const textRotate = -20;

      function addWaterMarker(parentNode: HTMLElement) {
        const can = document.createElement('canvas');
        parentNode.appendChild(can);
        can.width = width;
        can.height = height;
        can.style.display = 'none';
        const cans = can.getContext('2d');
        if (cans) {
          cans.rotate((textRotate * Math.PI) / 180);
          cans.font = font;
          cans.fillStyle = textColor;
          cans.textAlign = 'left';
          cans.textBaseline = 'middle';
          if (text1) cans.fillText(text1 || '水印', 0, height - 40);
          if (text2) cans.fillText(text2, 0, height - 20);
          if (text3) cans.fillText(text3, 0, height);
          // 将水印返回成图片
          parentNode.style.backgroundImage = `url(${can.toDataURL('image/png')})`;
        }
      }

      addWaterMarker(el);
    }
  };
  app.directive('watermark', watermarkDirective);
}
