import { isDev } from '@/env'
import { isInIframe } from '@/utils'
import { isFn, isObject, isPrimitive } from '@0x-jerry/utils'
import { FolderApi, Pane } from 'tweakpane'
import type { PaneConfig } from 'tweakpane/dist/types/pane/pane-config'
import { ComputedRef } from 'vue'

export type UseOptionGUIResult<T extends DatGUISchemaObject> = ComputedRef<
  ExtractDatGUISchemaObject<T>
>

export function useOptionGUI<T extends DatGUISchemaObject>(data: T, opt?: PaneConfig) {
  const route = useRoute()

  const cache = isDev ? useLocalStorage<T>(route.fullPath, data) : ref(data)
  cache.value = Object.assign({}, data, cache.value)
  if (isDev) {
    ;(cache.value as any).clearCache = () => {
      resetCache()
      location.reload()
    }
  }

  const result = computed(() => getDatGUISchemObjectValue(cache.value)) as UseOptionGUIResult<T>

  if (isInIframe) {
    return result
  }

  let gui: Pane | null = null

  opt = Object.assign(
    {
      container: document.querySelector('#option-gui-pos'),
      expanded: isDev,
    } as PaneConfig,
    opt,
  )
  console.log(opt)
  onMounted(() => {
    try {
      gui = new Pane(Object.assign({ title: 'options' }, opt))
      addDatGUIByType(cache.value, gui)
    } catch (error) {
      gui?.dispose()

      cache.value = data
      gui = new Pane(Object.assign({ title: 'options' }, opt))
      addDatGUIByType(cache.value, gui)
    }
  })

  onUnmounted(() => {
    gui?.dispose()
  })

  return result

  function resetCache() {
    cache.value = { ...data }
  }
}

function getDatGUISchemObjectValue<T extends DatGUISchemaObject>(data: T) {
  const result: any = {}

  for (const key in data) {
    const value = data[key]

    if (isPrimitive(value)) {
      result[key] = value
      continue
    }

    if (!isObject(value)) {
      continue
    }

    if (isFn(value)) {
      continue
    }

    if (!isDatGUISchema(value)) {
      result[key] = getDatGUISchemObjectValue(value)
      continue
    }

    result[key] = value.value
  }

  return result as ExtractDatGUISchemaObject<T>
}

type ExtractDatGUISchemaObject<T extends DatGUISchemaObject> = {
  [key in keyof T]: T[key] extends DatGUISchema<infer V>
    ? V
    : T[key] extends string | number | boolean
    ? T[key]
    : T[key] extends DatGUISchemaObject
    ? ExtractDatGUISchemaObject<T[key]>
    : never
}

export type DatGUISchema<V = any, T = any> = {
  _: boolean | string
  value: V
  min?: number
  max?: number
  step?: number
  options?: T[] | {}
}

export type DatGUISchemaObject = {
  [key: string]: string | number | boolean | DatGUISchema | DatGUISchemaObject | (() => any)
}

function addDatGUIByType<T extends DatGUISchemaObject>(data: T, gui: FolderApi) {
  for (const key in data) {
    const value = data[key as keyof T]

    if (isPrimitive(value)) {
      gui.addBinding(data, key)
      continue
    }

    if (isFn(value)) {
      gui
        .addButton({
          title: key,
        })
        .on('click', value)
      continue
    }

    if (!isObject(value)) {
      continue
    }

    if (!isDatGUISchema(value)) {
      const folderGui = gui.addFolder({
        title: key,
      })

      addDatGUIByType(value, folderGui)
      continue
    }

    if (value._ === 'monitor') {
      gui.addBinding(value, 'value', { label: key, ...value })
      continue
    }

    gui.addBinding(value, 'value', { label: key, ...value })
  }
}

function isDatGUISchema(o: any): o is DatGUISchema {
  return o?.['_']
}
