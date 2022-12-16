import { Ref, watch, computed, PropType, ExtractPropTypes } from 'vue'

import type { DataTableRow, DataTableFilterMethod, DataTableItem } from '../types'

export const useFilterableProps = {
  filter: { type: String, default: '' },
  filterMethod: { type: Function as PropType<DataTableFilterMethod | undefined> },
}

export type TFilteredArgs = { items: DataTableItem[], itemsIndexes: number[] }
export type TFilterableEmits = (event: 'filtered', arg: TFilteredArgs) => void

export function useFilterable (
  rawRows: Ref<DataTableRow[]>,
  props: ExtractPropTypes<typeof useFilterableProps>,
  emit: TFilterableEmits,
) {
  const filteredRows = computed<DataTableRow[]>(() => {
    if (!rawRows.value.length) {
      return rawRows.value
    }

    if (props.filter === '' && !props.filterMethod) {
      return rawRows.value
    }

    return rawRows.value.filter(row => row.cells.some(cell => {
      return typeof props.filterMethod === 'function'
        ? props.filterMethod(cell.source)
        : cell.value.toLowerCase().includes(props.filter.toLowerCase())
    }))
  })

  watch(filteredRows, () => {
    emit('filtered', {
      items: filteredRows.value.map(row => row.source),
      itemsIndexes: filteredRows.value.map(row => row.initialIndex),
    })
  })

  return {
    filteredRows,
  }
}
