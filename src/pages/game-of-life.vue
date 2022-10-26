<script lang="ts" setup>
import Layout from '@/components/Layout.vue'
import { useCanvas } from '@/canvas'
import { Random } from '@/math'
import { useOptionGUI } from '@/hooks'
import { sleep } from '@0x-jerry/utils'
import { generatorRunner } from '@/utils'

// ______________

const option = useOptionGUI({
  color: '#f26f6f',
  size: {
    _: true,
    min: 5,
    step: 1,
    value: 20,
  },
  FPS: {
    _: true,
    step: 1,
    value: 24,
    min: 8,
    max: 60,
  },
  refresh() {
    generate()
  },
  reset() {
    option.reset()
    location.reload()
  },
})

// -----------

const ctx = useCanvas()

const random = Random()

type Status = 0 | 1

class Life {
  data: Status[] = []

  constructor(public w: number = 0, public h: number = 0) {}

  get(x: number, y: number): Status {
    const idx = y * this.w + x

    return this.data.at(idx) ?? 0
  }

  set(x: number, y: number, v: Status) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
      return
    }

    const idx = y * this.w + x

    this.data[idx] = v
  }

  forEach(cb: (v: Status, x: number, y: number) => any) {
    for (let y = 0; y < status.h; y++) {
      for (let x = 0; x < status.w; x++) {
        cb(this.get(x, y), x, y)
      }
    }
  }

  getSurroundCount(x: number, y: number) {
    let c = 0

    for (let _x = x - 1; _x <= x + 1; _x++) {
      for (let _y = y - 1; _y <= y + 1; _y++) {
        if (_x === x && _y === y) {
          continue
        }
        c += this.get(_x, _y)
      }
    }

    return c
  }
}

const status = new Life()

watch(
  () => option.value.size,
  () => {
    generate()
  },
)

const runner = generatorRunner(loop)

onMounted(() => {
  generate()

  runner.restart()
})

function generate() {
  const { width, height } = ctx.canvas
  const { size } = option.value

  status.w = Math.ceil(width / size)
  status.h = Math.ceil(height / size)

  status.data.length = 0

  status.forEach((_, x, y) => {
    status.set(x, y, Math.random() > 0.9 ? 1 : 0)
  })
}

async function* loop() {
  while (true) {
    draw()
    await sleep(1000 / option.value.FPS)
    yield
  }
}

function draw() {
  const { size } = option.value

  const next = new Life(status.w, status.h)

  status.forEach((value, x, y) => {
    const liveCount = status.getSurroundCount(x, y)
    const nextStatus =
      liveCount < 2 ? 0 : liveCount === 3 && value === 0 ? 1 : liveCount > 3 ? 0 : value

    if (nextStatus === 1 && liveCount > 3) {
      console.log(value, x, y, liveCount)
    }

    next.set(x, y, nextStatus)

    ctx.fillStyle = value === 0 ? 'white' : option.value.color

    ctx.fillRect(x * size, y * size, size, size)
  })

  status.data = next.data
}
</script>

<template>
  <Layout title="Conway's Game of Life">
    <div :ref="ctx.ref" class="w-full h-full"></div>
  </Layout>
</template>

<style lang="less" scoped></style>
