import { ExtractPropTypes, PropType } from 'vue'

import type {
  DataTableCell,
  DataTableRow,
  DataTableRowBind,
  DataTableCellBind,
} from '../types'

const isFunction = (val: unknown): val is Function => typeof val === 'function'
const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object'

export const useBindingProps = {
  rowBind: { type: null as unknown as PropType<DataTableRowBind | undefined> },
  cellBind: { type: null as unknown as PropType<DataTableCellBind | undefined> },
}

export function useBinding (props: ExtractPropTypes<typeof useBindingProps>) {
  const getRowBind = (row: DataTableRow) => (
    isFunction(props.rowBind)
      ? props.rowBind(row.source, row.initialIndex)
      : isObject(props.rowBind)
        ? props.rowBind
        : {}
  ) as Record<string, string>

  const getCellBind = (cell: DataTableCell, row: DataTableRow) => (
    isFunction(props.cellBind)
      ? props.cellBind(cell.source, row.source, cell.column, row.initialIndex)
      : isObject(props.cellBind)
        ? props.cellBind
        : {}
  ) as Record<string, string>

  return {
    getRowBind,
    getCellBind,
  }
}
