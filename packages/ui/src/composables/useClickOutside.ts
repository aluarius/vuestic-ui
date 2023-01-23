import { Ref, unref } from 'vue'

import { useCaptureEvent } from './useCaptureEvent'
import { extractHTMLElement } from './useHTMLElement'

const checkIfElementChild = (parent: HTMLElement, child: HTMLElement | null | undefined): boolean => {
  if (!child) { return false }
  if (child.parentElement === parent) { return true }

  return parent.contains(child)
}

type MaybeRef<T> = T | Ref<T>
type MaybeArray<T> = T | T[]

const safeArray = <T>(a: MaybeArray<T>) => Array.isArray(a) ? a : [a]

export const useClickOutside = (elements: MaybeArray<MaybeRef<HTMLElement | undefined>>, cb: (el: HTMLElement) => void) => {
  useCaptureEvent('click', (event: MouseEvent) => {
    const clickTarget = event.target as HTMLElement

    const isClickInside = safeArray(elements)
      .some((element) => {
        const el = extractHTMLElement(unref(element))
        return el && checkIfElementChild(el, clickTarget)
      })

    if (!isClickInside) { cb(clickTarget) }
  })
}
