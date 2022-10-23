export const isInIframe = window.parent !== window

export function generatorRunner<T extends (...args: any[]) => AsyncGenerator | Generator>(fn: T) {
  let runner: GeneratorRunner<T> | null = null

  return {
    get current() {
      return runner?.current
    },
    async restart(...args: Parameters<T>) {
      if (runner) {
        await runner.pause()
      }

      runner = new GeneratorRunner(fn)
      runner.start(...args)
    },
    pause() {
      return runner?.pause()
    },
    resume() {
      return runner?.resume()
    },
  }
}

class GeneratorRunner<T extends (...args: any[]) => AsyncGenerator | Generator> {
  isPause = false

  #currentResult?: IteratorResult<unknown> | Promise<IteratorResult<unknown>>

  #started = false

  get current() {
    return this.#currentResult
  }

  constructor(public readonly fn: T) {}

  async start(...parameters: Parameters<T>) {
    if (this.#started) {
      return
    }

    this.#started = true
    this.isPause = false

    const generator = this.fn(...parameters)

    while (!this.isPause) {
      this.#currentResult = generator.next()

      if ((await this.#currentResult).done) {
        return
      }
    }
  }

  async pause() {
    this.isPause = true
    await this.current
  }

  resume() {
    this.isPause = false
  }
}
