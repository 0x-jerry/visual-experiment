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
      const type = value['_']
      if (!type) {
        const folderGui = gui.addFolder(key)
        resolveGUIType(value, folderGui)
        continue
      }

      if (type === 'color') {
        gui.addColor(value, 'value')
      } else {
        const { min, max, step } = value
        gui.add(value, 'value', min, max, step)
      }

      continue
    }
  }
}
