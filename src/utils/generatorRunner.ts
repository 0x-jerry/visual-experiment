import { EventEmitter } from '@0x-jerry/utils'

export function generatorRunner<T extends (...args: any[]) => AsyncGenerator | Generator>(fn: T) {
  let runner: GeneratorRunner<T> | null = null

  const emitter = new EventEmitter<GeneratorRunnerEvent>()

  const status = {
    get started() {
      return !!runner?.started
    },
    get paused() {
      return !!runner?.paused
    },
  }

  const ctx = {
    emitter,
    status,
    get current() {
      return runner?.current
    },
    async recreate(...args: Parameters<T>) {
      if (runner) {
        await runner.pause()
      }

      runner = new GeneratorRunner(fn)

      runner.on('done', () => emitter.emit('done'))
      runner.on('next', () => emitter.emit('next'))

      runner.create(...args)
    },
    async restart(...args: Parameters<T>) {
      await ctx.recreate(...args)
      ctx.resume()
    },
    pause() {
      return runner?.pause()
    },
    resume() {
      return runner?.resume()
    },
  }

  return ctx
}

type GeneratorRunnerEvent = {
  next(): void
  done(): void
}

class GeneratorRunner<
  T extends (...args: any[]) => AsyncGenerator | Generator,
> extends EventEmitter<GeneratorRunnerEvent> {
  paused = false

  #currentResult?: IteratorResult<unknown> | Promise<IteratorResult<unknown>>

  started = false

  #generator?: ReturnType<T>

  get current() {
    return this.#currentResult
  }

  constructor(public readonly fn: T) {
    super()
  }

  async create(...parameters: Parameters<T>) {
    if (this.started) {
      return
    }

    this.started = true
    this.paused = true

    this.#generator = this.fn(...parameters) as ReturnType<T>
  }

  async pause() {
    this.paused = true
    await this.current
  }

  async resume() {
    if (!this.started || !this.#generator) {
      return
    }

    this.paused = false

    while (!this.paused) {
      this.#currentResult = this.#generator.next()
      this.emit('next')

      if ((await this.#currentResult).done) {
        this.emit('done')
        this.started = false
        return
      }
    }
  }
}
