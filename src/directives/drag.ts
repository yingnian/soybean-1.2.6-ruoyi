import type { App } from 'vue';

/**
 * 自定义拖动指令
 *
 * 使用方式：v-drag="[dragDom,dragHeader]"，如 `<div v-drag="['.n-modal', '.n-card-header']"></div>`
 *
 * dragDom 要拖动的元素，dragHeader 要拖动的 Header 位置
 *
 * 注意传入的 类名或id名具有唯一性 可传入父子级关系 `<div v-drag="['.n-modal', '.drag_card .n-card-header']"
 */
export default function dragDirective(app: App) {
  app.directive('drag', {
    // eslint-disable-next-line consistent-return, @typescript-eslint/no-unused-vars
    mounted(el, binding) {
      if (!binding.value) return false;

      const dragDom = document.querySelector(binding.value[0]) as HTMLElement;
      const dragHeader = document.querySelector(binding.value[1]) as HTMLElement;

      dragHeader.onmouseover = () => (dragHeader.style.cursor = `move`);

      function down(e: any, type: string) {
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = type === 'pc' ? e.clientX - dragHeader.offsetLeft : e.touches[0].clientX - dragHeader.offsetLeft;
        const disY = type === 'pc' ? e.clientY - dragHeader.offsetTop : e.touches[0].clientY - dragHeader.offsetTop;

        // body当前宽度
        const screenWidth = document.body.clientWidth;
        // 可见区域高度(应为body高度，可某些环境下无法获取)
        const screenHeight = document.documentElement.clientHeight;

        // 对话框宽度
        const dragDomWidth = dragDom.offsetWidth;
        // 对话框高度
        const dragDomheight = dragDom.offsetHeight;

        const minDragDomLeft = dragDom.offsetLeft;
        const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;

        const minDragDomTop = dragDom.offsetTop;
        const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;

        // 获取到的值带px 正则匹配替换
        let styL: any = getComputedStyle(dragDom).left;
        let styT: any = getComputedStyle(dragDom).top;

        // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
        if (styL.includes('%')) {
          styL = Number(document.body.clientWidth) * (Number(styL.replace(/%/g, '')) / 100);
          styT = Number(document.body.clientHeight) * (Number(styT.replace(/%/g, '')) / 100);
        } else {
          styL = Number(styL.replace(/\px/g, ''));
          styT = Number(styT.replace(/\px/g, ''));
        }

        return {
          disX,
          disY,
          minDragDomLeft,
          maxDragDomLeft,
          minDragDomTop,
          maxDragDomTop,
          styL,
          styT
        };
      }

      function move(e: any, type: string, obj: any) {
        const { disX, disY, minDragDomLeft, maxDragDomLeft, minDragDomTop, maxDragDomTop, styL, styT } = obj;

        // 通过事件委托，计算移动的距离
        let left = type === 'pc' ? e.clientX - disX : e.touches[0].clientX - disX;
        let top = type === 'pc' ? e.clientY - disY : e.touches[0].clientY - disY;

        // 边界处理
        if (-left > minDragDomLeft) {
          left = -minDragDomLeft;
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft;
        }

        if (-top > minDragDomTop) {
          top = -minDragDomTop;
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop;
        }

        // 移动当前元素
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
      }

      /** pc端 onmousedown 鼠标按下触发事件 onmousemove 鼠标按下时持续触发事件 onmouseup 鼠标抬起触发事件 */
      dragHeader.onmousedown = e => {
        const obj = down(e, 'pc');
        document.onmousemove = ee => {
          move(ee, 'pc', obj);
        };
        document.onmouseup = () => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };

      /** 移动端 ontouchstart 当按下手指时，触发ontouchstart ontouchmove 当移动手指时，触发ontouchmove ontouchend 当移走手指时，触发ontouchend */
      dragHeader.ontouchstart = e => {
        const obj = down(e, 'app');
        document.ontouchmove = ed => {
          move(ed, 'app', obj);
        };
        document.ontouchend = () => {
          document.ontouchmove = null;
          document.ontouchend = null;
        };
      };
    }
  });
}
