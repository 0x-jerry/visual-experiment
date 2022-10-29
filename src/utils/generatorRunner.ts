import { EventEmitter } from '@0x-jerry/utils'

export function generatorRunner<T extends (...args: any[]) => AsyncGenerator | Generator>(fn: T) {
  let runner: GeneratorRunner<T> | null = null

  const emitter = new EventEmitter<GeneratorRunnerEvent>()

  const status = {
    started: false,
    paused: true,
    done: false,
  }

  return {
    emitter,
    status,
    get current() {
      return runner?.current
    },
    async restart(...args: Parameters<T>) {
      if (runner) {
        await runner.pause()
      }

      runner = new GeneratorRunner(fn)

      runner.on('done', () => {
        status.done = true
        emitter.emit('done')
      })
      runner.on('next', () => emitter.emit('next'))

      runner.start(...args)

      status.done = false
      status.started = true
    },
    pause() {
      status.paused = true
      return runner?.pause()
    },
    resume() {
      status.paused = false
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

  #generator?: ReturnType<T>

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

    this.#generator = this.fn(...parameters) as ReturnType<T>

    this.resume()
  }

  async pause() {
    this.isPause = true
    await this.current
  }

  async resume() {
    this.isPause = false

    if (!this.#generator) {
      return
    }

    while (!this.isPause) {
      this.#currentResult = this.#generator.next()
      this.emit('next')

      if ((await this.#currentResult).done) {
        this.emit('done')
        return
      }
    }
  }
}
