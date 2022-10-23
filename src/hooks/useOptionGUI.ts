import { isInIframe } from '@/utils'
import { is } from '@0x-jerry/utils'
import { FolderApi, Pane } from 'tweakpane'
import type { PaneConfig } from 'tweakpane/dist/types/pane/pane-config'
import { ComputedRef } from 'vue'

export type UseOptionGUIResult<T extends DatGUISchemaObject> = ComputedRef<
  ExtractDatGUISchemaObject<T>
> & {
  reset(): void
}

export function useOptionGUI<T extends DatGUISchemaObject>(data: T, opt?: PaneConfig) {
  const route = useRoute()

  const cache = useLocalStorage<T>(route.fullPath, data)
  cache.value = Object.assign({}, data, cache.value)

  const $data = cache.value
  const result = computed(() => getDatGUISchemObjectValue($data)) as UseOptionGUIResult<T>

  if (isInIframe) {
    return result
  }

  let gui: Pane | null = null

  onMounted(() => {
    gui = new Pane(Object.assign({ title: 'options' }, opt))

    addDatGUIByType($data, gui)
  })

  onUnmounted(() => {
    gui?.dispose()
  })

  result.reset = resetCache

  return result

  function resetCache() {
    cache.value = { ...data }
  }
}

function getDatGUISchemObjectValue<T extends DatGUISchemaObject>(data: T) {
  const result: any = {}

  for (const key in data) {
    const value = data[key]

    if (is.primitive(value)) {
      result[key] = value
      continue
    }

    if (!is.object(value)) {
      continue
    }

    if (is.fn(value)) {
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

    if (is.primitive(value)) {
      gui.addInput(data, key)
      continue
    }

    if (is.fn(value)) {
      gui
        .addButton({
          title: key,
        })
        .on('click', value)
      continue
    }

    if (!is.object(value)) {
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
      gui.addMonitor(value, 'value', { label: key, ...value })
      continue
    }

    gui.addInput(value, 'value', { label: key, ...value })
  }
}

function isDatGUISchema(o: any): o is DatGUISchema {
  return o?.['_']
}
