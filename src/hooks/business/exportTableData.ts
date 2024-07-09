/*
 * @Description: vxe-grid 通用导出方法
 * @Author: jiansheng
 * @Date: 2023-04-27 09:46:06
 *
 * 前置条件
 * 需要在 <vxe-grid ref="xxx"></vxe-grid> 上添加 ref
 * 需要在 vxe-grid 的配置中加上 exportConfig
 *
 * 使用方式
 * import { useExportData } from '@/hooks/business';
 *
 * const pageTableRef = ref();
 * const { exportLoading, exportData, exportConfig } = useExportData(listRole, tablePage, 12, '角色表', pageTableRef);
 *
 * 可参考 【角色管理】 /src/views/system/role/index.vue
 * 【用户管理】的导出 没有修改成此方式，只是为了保留另一种单独的页面导出方式，有不适配此功能的导出时，可参照【用户管理】编写
 *
 * 注意：
 * - 最终导出的数据 默认取的是 data.rows (一般若依的分页列表都是这种形式)，如果有不是的页面 可自行适配
 * - 需要把 total(数据总条数) 参数放入 searchParams
 */
import { ref } from 'vue';
import type { Ref } from 'vue';
import { exportConfig } from '@/plugins/vxeTable';

type ListFunction = (arg: any) => any;

interface ExportDataHook {
  // 导出按钮的loading
  exportLoading: Ref<boolean>;
  // 导出按钮触发的方法
  exportData: () => void;
  // vxe-grid的导出配置
  exportConfig: any;
}

const exportLoading = ref<boolean>(false);
export function useExportData(
  fn: ListFunction,
  searchParams: Record<string, any>,
  name: string,
  refName: any
): ExportDataHook {
  /**
   * @param {Function(Promise)} fn 列表请求方法
   * @param {Object} searchParams 查询参数
   * @param {String} name 导出文件名称
   * @description: 导出方法
   */
  const exportData = () => {
    refName.value!.openExport({
      type: 'xlsx',
      mode: 'all',
      modes: ['current', 'all'],
      isMerge: true,
      useStyle: false,
      isColgroup: true,
      sheetName: 'Sheet1',
      filename: name,
      remote: true,
      exportMethod: async ({ options }: { options: any }) => {
        const { mode, isMerge, useStyle, isColgroup, sheetName, filename } = options;
        let _pageNum = 1;
        let _pageSize = 10;
        if (mode === 'all') {
          _pageSize = searchParams.total;
          _pageNum = 1;
        } else {
          _pageSize = searchParams.pageSize;
          _pageNum = searchParams.pageNum;
        }

        exportLoading.value = true;
        const { data } = await fn({ ...searchParams, pageSize: _pageSize, pageNum: _pageNum });
        exportLoading.value = false;

        refName.value!.exportData({
          type: 'xlsx',
          isMerge,
          useStyle,
          isColgroup,
          sheetName,
          filename,
          data: data.rows,
          mode
        });
      }
    });
  };

  return {
    exportLoading,
    exportData,
    exportConfig
  };
}
