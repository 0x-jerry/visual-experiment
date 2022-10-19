import { is } from '@0x-jerry/utils'
import { GUI, GUIParams } from 'dat.gui'

export function useDatGUI<T extends DatGUISchemaObject>(data: T, opt?: GUIParams) {
  const $data = reactive(data) as T

  let gui: GUI | null = null

  onMounted(() => {
    gui = new GUI(opt)
    addDatGUIByType($data, gui)
  })

  onUnmounted(() => {
    gui?.destroy()
  })

  return computed(() => getDatGUISchemObjectValue($data))
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
  items?: T[]
}

export type DatGUISchemaObject = {
  [key: string]: string | number | boolean | DatGUISchema | DatGUISchemaObject
}

function addDatGUIByType<T extends DatGUISchemaObject>(data: T, gui: GUI) {
  for (const key in data) {
    const value = data[key as keyof T]

    if (is.primitive(value)) {
      gui.add(data, key as string)
      continue
    }

    if (!is.object(value)) {
      continue
    }

    if (!isDatGUISchema(value)) {
      const folderGui = gui.addFolder(key)

      addDatGUIByType(value, folderGui)
      continue
    }

    const type = value._

    if (type === 'color') {
      gui.addColor(value, 'value').name(key)
    } else {
      const { min, max, step, items } = value

      if (items) {
        gui.add(value, 'value', items).name(key)
      } else {
        gui.add(value, 'value', min, max, step).name(key)
      }
    }
  }
}

function isDatGUISchema(o: any): o is DatGUISchema {
  return o?.['_']
}
