import type { App, Directive, DirectiveBinding } from 'vue';
import { useAuthStore } from '@/store/modules/auth';

export default function setupPremiDirective(app: App) {
  const hasPermiDirective: Directive<HTMLElement, boolean | undefined> = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      const { value } = binding;
      const allPermission = '*:*:*';

      const authStore = useAuthStore();
      const { permissions } = authStore;

      if (Boolean(value) && Array.isArray(value) && value.length > 0) {
        const permissionFlag = value;

        const hasPermissions = permissions && permissions.some(i => allPermission === i || permissionFlag.includes(i));

        if (!hasPermissions) el.parentNode?.removeChild(el);
      } else {
        throw new Error(`请设置操作权限标签值`);
      }
    }
  };

  app.directive('hasPermi', hasPermiDirective);
}
