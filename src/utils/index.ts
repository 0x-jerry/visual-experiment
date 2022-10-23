export const isInIframe = window.parent !== window

export function generatorRunner<T extends (...args: any[]) => AsyncGenerator | Generator>(
  generatorFn: T,
) {
  let ins = null
  let isStop = false

  let currentResult: IteratorResult<unknown> | Promise<IteratorResult<unknown>> | null = null

  async function reset(...parameters: Parameters<T>) {
    ins = generatorFn(...parameters)
    isStop = false

    while (!isStop) {
      currentResult = ins.next()
      if ((await currentResult).done) {
        return
      }
    }
  }

  async function pause() {
    isStop = true
    await currentResult
  }

  function resume() {
    isStop = false
  }

  return {
    get current() {
      return currentResult
    },
    reset,
    pause,
    resume,
    toggle() {
      if (isStop) {
        resume()
      } else {
        pause()
      }
    },
  }
}
