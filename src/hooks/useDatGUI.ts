import { is } from '@0x-jerry/utils'
import { GUI, GUIParams } from 'dat.gui'

export function useDatGUI<T extends {}>(data: T, opt?: GUIParams) {
  let gui: GUI | null = null

  onMounted(() => {
    gui = new GUI(opt)
    resolveGUIType(data, gui)
  })

  onUnmounted(() => {
    gui?.destroy()
  })

  return gui
}

function resolveGUIType<T extends {}>(data: T, gui: GUI) {
  const keys = Object.keys(data)

  for (const key of keys) {
    const value = data[key as keyof T] as any

    if (is.primitive(value)) {
      gui.add(data, key as string)
      continue
    }

    if (is.object(value)) {
      const customType = value['_']

      if (!customType) {
        const folderGui = gui.addFolder(key)
        resolveGUIType(value, folderGui)
        continue
      }

      if (customType === 'color') {
        gui.addColor(value, 'value').name(key)
      } else {
        const { min, max, step, items } = value

        if (items) {
          gui.add(value, 'value', items).name(key)
        } else {
          gui.add(value, 'value', min, max, step).name(key)
        }
      }

      continue
    }
  }
}
