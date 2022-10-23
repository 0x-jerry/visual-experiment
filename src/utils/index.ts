import { EventEmitter } from '@0x-jerry/utils'

export const isInIframe = window.parent !== window

export function generatorRunner<T extends (...args: any[]) => AsyncGenerator | Generator>(fn: T) {
  let runner: GeneratorRunner<T> | null = null

  const emitter = new EventEmitter<GeneratorRunnerEvent>()

  return {
    emitter,
    get current() {
      return runner?.current
    },
    async restart(...args: Parameters<T>) {
      if (runner) {
        await runner.pause()
      }

      runner = new GeneratorRunner(fn)

      runner.on('done', () => emitter.emit('done'))
      runner.on('next', () => emitter.emit('next'))

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

type GeneratorRunnerEvent = {
  next(): void
  done(): void
}

class GeneratorRunner<
  T extends (...args: any[]) => AsyncGenerator | Generator,
> extends EventEmitter<GeneratorRunnerEvent> {
  isPause = false

  #currentResult?: IteratorResult<unknown> | Promise<IteratorResult<unknown>>

  #started = false

  get current() {
    return this.#currentResult
  }

  constructor(public readonly fn: T) {
    super()
  }

  async start(...parameters: Parameters<T>) {
    if (this.#started) {
      return
    }

    this.#started = true
    this.isPause = false

    const generator = this.fn(...parameters)

    while (!this.isPause) {
      this.#currentResult = generator.next()
      this.emit('next')

      if ((await this.#currentResult).done) {
        this.emit('done')
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
