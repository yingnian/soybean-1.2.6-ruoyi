import VXETable from 'vxe-table';
import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx';
import XEUtils from 'xe-utils';
import ExcelJS from 'exceljs';

VXETable.setConfig({
  size: null, // 全局尺寸
  zIndex: 1030, // 全局 zIndex 起始值，如果项目的的 z-index 样式值过大时就需要跟随设置更大，避免被遮挡
  // version: 0, // 版本号，对于某些带数据缓存的功能有用到，上升版本号可以用于重置数据
  table: {
    align: 'center',
    showHeader: true,
    keepSource: false,
    showOverflow: 'tooltip',
    showHeaderOverflow: null,
    showFooterOverflow: null,
    size: 'mini',
    autoResize: true,
    stripe: false,
    border: true,
    round: false,
    emptyText: '暂无数据',
    rowConfig: {
      isHover: true,
      keyField: '_X_ROW_KEY' // 行数据的唯一主键字段名
    },
    columnConfig: {
      minWidth: 120,
      resizable: true
    },
    radioConfig: {
      trigger: 'default'
    },
    checkboxConfig: {
      strict: false,
      highlight: false,
      range: false,
      trigger: 'default'
    },
    sortConfig: {
      remote: false,
      trigger: 'default',
      orders: ['asc', 'desc', null],
      sortMethod: undefined
    },
    filterConfig: {
      remote: false,
      filterMethod: undefined
    },
    expandConfig: {
      trigger: 'default',
      showIcon: true
    },
    treeConfig: {
      rowField: 'id',
      parentField: 'parentId',
      childrenField: 'children',
      hasChild: 'hasChild',
      mapChildrenField: '_X_ROW_CHILD',
      indent: 20,
      showIcon: true
    },
    tooltipConfig: {
      enterable: true
    },
    menuConfig: {},
    editConfig: {
      mode: 'cell',
      showAsterisk: true
    },
    importConfig: {
      modes: ['insert', 'covering']
    },
    exportConfig: {
      modes: ['current', 'selected']
    },
    customConfig: {
      storage: false
    },
    scrollX: {
      gt: 60
    },
    scrollY: {
      gt: 100
    }
  },
  grid: {
    size: 'small',
    zoomConfig: {
      escRestore: true
    },
    pagerConfig: {
      perfect: false
    },
    toolbarConfig: {
      custom: true,
      slots: {
        buttons: 'toolbar_buttons'
      }
    },
    proxyConfig: {
      autoLoad: true,
      message: true,
      props: {
        list: null, // 用于列表，读取响应数据
        result: 'result', // 用于分页，读取响应数据
        total: 'page.total' // 用于分页，读取总条数
      },
      beforeItem: null,
      beforeColumn: null,
      beforeQuery: null,
      afterQuery: null,
      beforeDelete: null,
      afterDelete: null,
      beforeSave: null,
      afterSave: null
    }
  },
  pager: {
    size: null,
    autoHidden: false,
    perfect: true,
    pageSize: 10,
    pagerCount: 7,
    pageSizes: [10, 15, 20, 50, 100],
    layouts: ['PrevJump', 'PrevPage', 'Jump', 'PageCount', 'NextPage', 'NextJump', 'Sizes', 'Total']
  }
  // form: {
  //   preventSubmit: false
  //   size: null,
  //   colon: false,
  //   validConfig: {
  //     autoPos: true
  //   },
  //   tooltipConfig: {
  //     enterable: true
  //   },
  //   titleAsterisk: true
  // },
  // input: {
  //   size: null,
  //   transfer: false
  //   parseFormat: 'yyyy-MM-dd HH:mm:ss.SSS',
  //   labelFormat: '',
  //   valueFormat: '',
  //   startDay: 1,
  //   digits: 2,
  //   controls: true
  // },
  // textarea: {
  //   size: null
  //   autosize: {
  //     minRows: 1,
  //     maxRows: 10
  //   }
  // },
  // select: {
  //   size: null,
  //   transfer: false,
  //   optionConfig: {
  //     keyField: '_X_OPTION_KEY' // 选项数据的唯一主键字段名
  //   },
  //   multiCharOverflow: 8
  // },
  // toolbar: {
  //   size: null,
  //   import: {
  //     mode: 'covering'
  //   },
  //   export: {
  //     types: ['csv', 'html', 'xml', 'txt']
  //   },
  //   custom: {
  //     isFooter: true
  //   },
  //   buttons: [],
  //   tools: []
  // },
  // button: {
  //   size: null,
  //   transfer: false
  // },
  // radio: {
  //   size: null
  // },
  // checkbox: {
  //   size: null
  // },
  // switch: {
  //   size: null
  // },
  // modal: {
  //   // size: null,
  //   minWidth: 340,
  //   minHeight: 200,
  //   lockView: true,
  //   mask: true,
  //   duration: 3000,
  //   marginSize: 0,
  //   dblclickZoom: true,
  //   showTitleOverflow: true
  //   storage: false
  // },
  // list: {
  //   scrollY: {
  //     gt: 100
  //   }
  // }
});

VXETable.use(VXETablePluginExportXLSX, {
  ExcelJS
});
export default VXETable;

// 表格导出规则
export const exportConfig = {
  fileName: '',
  sheetName: 'Sheet1',
  types: ['xlsx'],
  modes: ['current', 'all'],
  isMerge: true,
  useStyle: true,
  isColgroup: true,
  data: [],
  columnFilterMethod: ({ column }: { column: any }) => {
    if (!column.field || ['checkbox', 'radio'].includes(column.type)) return false;
    return true;
  }
};

function getMultLabel(value: string, list: Record<string, any>[]) {
  const _value = value.split(',') || [];
  const _item: any = [];
  list.forEach(i => {
    if (_value.includes(i.value)) _item.push(i.title || i.label);
  });

  return _item.join();
}

// 自定义全局的格式化处理函数
VXETable.formats.mixin({
  // 格式化性别 formatter="formatDate"
  formatSex({ cellValue }) {
    // eslint-disable-next-line no-nested-ternary
    return cellValue ? (cellValue === '1' ? '男' : '女') : '';
  },
  /**
   * @param {string | number} cellValue 需要回显的value
   * @param {array} list 字典 [{title: '', value: string|number }]
   * @returns {string} 回显值
   * @description: 格式化下拉选项
   */
  formatDicts({ cellValue }, list) {
    if (!cellValue) return '';
    const valIsString = typeof cellValue === 'string';

    let item = '';
    if (valIsString && cellValue.includes(',')) {
      // 多选 cellValue === '1,2,3' 这种
      item = getMultLabel(cellValue, list);
    } else {
      // 单选
      const row = list.find((i: any) => i.value === cellValue);
      item = row ? row.title || row.label : cellValue;
    }
    return item;
  },
  // 格式化日期，默认 yyyy-MM-dd  :formatter="['formatDate', 'yyyy-MM-dd']"
  formatDate({ cellValue }, format) {
    return XEUtils.toDateString(cellValue, format || 'yyyy-MM-dd HH:mm:ss');
  },
  // 四舍五入金额，每隔3位逗号分隔，默认2位数
  formatAmount({ cellValue }, digits = 2) {
    return XEUtils.commafy(Number(cellValue), { digits });
  },
  // 格式化银行卡，默认每4位空格隔开
  formatBankcard({ cellValue }) {
    return XEUtils.commafy(XEUtils.toValueString(cellValue), { spaceNumber: 4, separator: ' ' });
  },
  // 四舍五入,默认两位数
  formatFixedNumber({ cellValue }, digits = 2) {
    return XEUtils.toFixed(XEUtils.round(cellValue, digits), digits);
  },
  // 向下舍入,默认两位数
  formatCutNumber({ cellValue }, digits = 2) {
    return XEUtils.toFixed(XEUtils.floor(cellValue, digits), digits);
  }
});
