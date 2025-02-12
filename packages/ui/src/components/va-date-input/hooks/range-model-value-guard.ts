import { computed, Ref, ref, watch } from 'vue'
import { VaDateInputModelValue } from '../types'
import { parseModelValue, isRange } from './model-value-parser'

/**
 * This guard is used to prevent updating modelValue if range end is not specified.
 * This guard provides reset method, that allow us to reset VaDateInput value if dropdown is closed.
 */
export const useRangeModelValueGuard = (
  modelValue: Ref<VaDateInputModelValue>,
  disabled: Ref<boolean>,
  parseValue = parseModelValue,
) => {
  const bufferValue = ref<VaDateInputModelValue>(modelValue.value && parseValue(modelValue.value))

  const valueComputed = computed({
    get: () => bufferValue.value,
    set: (value) => {
      if (disabled.value) {
        modelValue.value = value
      }

      if (!value) {
        modelValue.value = value
        return
      }

      if (isRange(value)) {
        if (value.end !== null) {
          modelValue.value = value
        }
      } else {
        modelValue.value = value
      }

      bufferValue.value = value
    },
  })

  watch(modelValue, (newValue) => {
    bufferValue.value = newValue
  })

  const reset = () => {
    if (bufferValue.value && isRange(bufferValue.value)) {
      bufferValue.value = modelValue.value && parseValue(modelValue.value)
    }
  }

  return {
    valueComputed,
    reset,
  }
}
