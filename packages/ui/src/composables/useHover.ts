import { PropType, ref, Ref, watch } from 'vue'

export const useHoverProps = {
  hoverBehaviour: {
    type: String as PropType<'opacity' | 'mask'>,
    default: 'mask',
    validator: (value: string) => ['opacity', 'mask'].includes(value),
  },
  hoverOpacity: { type: Number, default: 0.15 },
  hoverMaskColor: { type: String, default: 'white' },
}

const getEl = (el: any) => el.$el ?? el

export function useHover (el?: Ref<HTMLElement | null | undefined>) {
  const isHovered = ref(false)

  const onMouseEnter = () => { isHovered.value = true }
  const onMouseLeave = () => { isHovered.value = false }

  if (el) {
    watch(el, (n, o) => {
      if (n) {
        const newEl = getEl(n)
        newEl.addEventListener('mouseenter', onMouseEnter)
        newEl.addEventListener('mouseleave', onMouseLeave)
      }
      if (o) {
        const oldEl = getEl(o)
        oldEl.removeEventListener('mouseenter', onMouseEnter)
        oldEl.removeEventListener('mouseleave', onMouseLeave)
      }
    })
  }

  return { isHovered, onMouseEnter, onMouseLeave }
}
