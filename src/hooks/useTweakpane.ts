import { clamp } from '@0x-jerry/utils'
import { tryOnUnmounted, useDraggable, useEventListener, useLocalStorage } from '@vueuse/core'
import {
  FolderApi,
  Pane,
  type BindingParams,
  type ButtonParams,
  type FolderParams,
} from 'tweakpane'
import { reactive } from 'vue'

export interface TweakpaneObject {
  key: string
  /**
   * Value must not be null or undefined
   */
  value: unknown
  label?: string
  config?: BindingParams
}

export interface TweakpaneFunction {
  title: string
  config?: Omit<ButtonParams, 'title'>
  action(): void
}

export interface TweakpaneGroup {
  key: string
  title?: string
  config?: Omit<FolderParams, 'title'>
  items: TweakpaneItem[]
}

export type TweakpaneItem = TweakpaneObject | TweakpaneGroup | TweakpaneFunction

export interface UseTweakpaneOptions {
  title?: string
  /**
   * Cache data in local storage
   */
  storageKey?: string
  width?: number
  stateCacheKey?: string
  items: TweakpaneItem[]
}

export function useTweakpane<T>(opt: UseTweakpaneOptions): T {
  const containerEl = document.createElement('div')
  containerEl.style.position = 'fixed'
  containerEl.style.left = '0px'
  containerEl.style.top = '0px'
  if (opt.width) {
    containerEl.style.width = opt.width + 'px'
  }

  const defaultState = {
    pos: {
      x: 0,
      y: 0,
    },
  }

  const state = opt.stateCacheKey
    ? useLocalStorage(opt.stateCacheKey, defaultState).value
    : defaultState

  const innerData = {
    isDragging: false,
  }

  updateUIPosition()
  document.body.append(containerEl)

  const api = new Pane({
    title: opt.title,
    container: containerEl,
  })

  const paneState = opt.storageKey ? useLocalStorage(opt.storageKey, {}).value : reactive({})
  initializePane(api, paneState, opt.items)

  useDraggable(containerEl, {
    onStart(position, event) {
      const target = event.target as HTMLElement
      if (!isPanelHeaderElement(target)) {
        return false
      }
    },
    onMove(position, event) {
      innerData.isDragging = true

      const x = state.pos.x + event.movementX
      const y = state.pos.y + event.movementY

      const el = containerEl

      state.pos.x = clamp(x, 0, window.innerWidth - el.clientWidth)
      state.pos.y = clamp(y, 0, window.innerHeight - el.clientHeight)

      updateUIPosition()
    },
    onEnd() {
      if (innerData.isDragging) {
        setTimeout(() => {
          innerData.isDragging = false
        }, 0)
      }
    },
  })

  useEventListener(
    containerEl,
    'click',
    (evt) => {
      if (isPanelHeaderElement(evt.target as HTMLElement) && innerData.isDragging) {
        console.log('stop')
        evt.stopPropagation()
      }
    },
    { capture: true },
  )

  tryOnUnmounted(() => {
    api.dispose()
    containerEl.remove()
  })

  return paneState as T

  function updateUIPosition() {
    containerEl.style.transform = `translate(${state.pos.x}px, ${state.pos.y}px)`
  }

  function isPanelHeaderElement(target: HTMLElement) {
    return target.classList.contains('tp-rotv_t') || target.classList.contains('tp-rotv_b')
  }

  function initializePane(root: FolderApi, data: any, configs: TweakpaneItem[]) {
    for (const conf of configs) {
      if ('items' in conf) {
        data[conf.key] ??= {}
        const folderApi = root.addFolder({
          ...conf.config,
          title: conf.title ?? conf.key,
        })

        initializePane(folderApi, data[conf.key], conf.items)
      } else if ('action' in conf) {
        const btn = root.addButton({
          title: conf.title,
          ...conf.config,
        })
        btn.on('click', () => conf.action())
      } else {
        data[conf.key] ??= conf.value

        root.addBinding(data, conf.key, {
          label: conf.label ?? conf.key,
          ...conf.config,
        })
      }
    }
  }
}
