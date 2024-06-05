<script lang="ts" setup>
import Layout from '@/components/Layout.vue'
import { Random } from '@/math'
import { useCanvasRunner, useOptionGUI } from '@/hooks'
import { Grid } from '@/math/grid'

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
})

// -----------

const random = Random()

class LifeGrid extends Grid {
  getSurroundCount(x: number, y: number) {
    let c = 0

    for (let _x = x - 1; _x <= x + 1; _x++) {
      for (let _y = y - 1; _y <= y + 1; _y++) {
        if (_x === x && _y === y) {
          continue
        }
        c += this.get(_x, _y) || 0
      }
    }

    return c
  }
}

const grid = new LifeGrid()

watch(
  () => option.value.size,
  () => {
    generate()
  },
)

const runner = useCanvasRunner(draw, {
  fps: () => option.value.FPS
})

onMounted(() => {
  generate()
})

function generate() {
  const canvas = runner.ctx.canvas

  const { width, height } = canvas
  const { size } = option.value

  grid.w = Math.ceil(width / size)
  grid.h = Math.ceil(height / size)

  grid.clear()

  grid.forEach((_, x, y) => {
    grid.set(x, y, Math.random() > 0.9 ? 1 : 0)
  })
}

function draw(ctx: CanvasRenderingContext2D) {
  const { size } = option.value

  const next = new LifeGrid(grid.w, grid.h)

  grid.forEach((value = 0, x, y) => {
    const liveCount = grid.getSurroundCount(x, y)
    const nextStatus =
      liveCount < 2 ? 0 : liveCount === 3 && value === 0 ? 1 : liveCount > 3 ? 0 : value

    if (nextStatus === 1 && liveCount > 3) {
      console.log(value, x, y, liveCount)
    }

    next.set(x, y, nextStatus)

    ctx.fillStyle = value === 0 ? 'white' : option.value.color

    ctx.fillRect(x * size, y * size, size, size)
  })

  grid.data = next.data
}
</script>

<template>
  <Layout title="Conway's Game of Life">
    <div :ref="runner.ctx.ref" class="w-full h-full"></div>
  </Layout>
</template>

<style lang="less" scoped></style>
