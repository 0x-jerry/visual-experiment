import { isDev } from '@/env'
import { isInIframe } from '@/utils'
import { isFn, isObject } from '@0x-jerry/utils'
import { FolderApi, Pane } from 'tweakpane'
import type { PaneConfig } from 'tweakpane/dist/types/pane/pane-config'

export type UseOptionGUIResult<T extends DatGUISchemaObject> = ExtractDatGUISchemaObject<T>

export function useOptionGUI<T extends DatGUISchemaObject>(data: T, opt?: PaneConfig) {
  const params = useUrlSearchParams('hash')

  const configs = normalizeDatGUISchema(data)

  const _result = composeValues(configs, params as Record<string, string>) as UseOptionGUIResult<T>

  const result = ref(_result)

  if (isInIframe) {
    return result
  }

  // add reset button
  let gui: Pane | null = null

  configs.push({
    _: 'button',
    _key: 'reset configs',
    value: () => {
      const defaultValue = composeValues(configs, {})
      Object.assign(result.value as any, structuredClone(defaultValue))
      gui?.refresh()
    },
  })

  opt = Object.assign(
    {
      container: document.querySelector('#option-gui-pos'),
      expanded: isDev,
    } as PaneConfig,
    opt,
  )

  watch(
    result,
    () => {
      console.log(result.value)
      Object.assign(params, result.value)
    },
    { deep: true },
  )

  onMounted(() => {
    gui = new Pane(Object.assign({ title: 'options' }, opt))
    addDatGUIByType(result, configs, gui)
  })

  onUnmounted(() => {
    gui?.dispose()
  })

  return result
}

function composeValues(configs: DatGUISchema[], urlParams: Record<string, string>) {
  const result: Record<string, any> = {}

  for (const conf of configs) {
    const { _, _key } = conf

    if (_ === 'button') {
      continue
    }

    const urlParamValue = urlParams[_key!]

    const value = urlParamValue ?? conf.value

    if (_ === 'boolean') {
      result[_key!] = !!value
    } else if (_ === 'string') {
      result[_key!] = String(value)
    } else if (_ === 'number') {
      result[_key!] = parseFloat(value)
    } else {
      console.error(conf)
    }
  }

  return result
}

function isRecord(t: unknown): t is Record<string, any> {
  return isObject(t)
}

function normalizeDatGUISchema(t: DatGUISchemaObject): DatGUISchema[] {
  return Object.entries(t).map(([key, conf]) => {
    if (isFn(conf)) {
      return {
        _: 'button',
        _key: key,
        value: conf,
      }
    }

    const _conf = isRecord(conf) ? conf : { _: true, value: conf }
    const _type = isRecord(conf) ? typeof conf.value : typeof conf

    const type = _conf._ === true ? _type : _conf._

    return {
      ..._conf,
      _key: key,
      _: type as any,
    }
  })
}

type ExtractDatGUISchemaObject<T extends DatGUISchemaObject> = {
  [key in keyof T]: T[key] extends DatGUISchema<infer V>
    ? V
    : T[key] extends string | number | boolean
    ? T[key]
    : never
}

export type DatGUISchema<V = any> = {
  _: true | 'button' | 'number' | 'string' | 'boolean'
  _key?: string
  value: V
  min?: number
  max?: number
  step?: number
  options?: any[] | {}
}

export type DatGUISchemaObject = {
  [key: string]: string | number | boolean | DatGUISchema | (() => any)
}

function addDatGUIByType(data: Ref<any>, configs: DatGUISchema[], gui: FolderApi) {
  for (const conf of configs) {
    const { _, _key, value, ...other } = conf

    if (_ === 'button') {
      gui.addButton({ title: _key! }).on('click', value)
      continue
    }

    gui.addBinding(data.value, _key!, other)
  }
}
