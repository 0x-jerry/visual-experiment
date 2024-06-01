<script lang="ts" setup>
import Layout from '@/components/Layout.vue'
import { clear, useCanvas } from '@/canvas'
import { PI, Random } from '@/math'
import { useOptionGUI } from '@/hooks'
import { Grid } from '@/math/grid'
import { useFPSRunner } from '@/hooks/useFPSRunner'
import { Vec2 } from '@/math/Vec'

class AntGrid extends Grid {
  ant: Vec2 = Vec2.zero

  dir: Vec2 = Vec2.up

  getAntGround() {
    const { x, y } = this.ant
    return this.get(x, y)
  }
}

// ______________

const option = useOptionGUI({
  color: '#f26f6f',
  size: {
    _: true,
    min: 1,
    step: 1,
    value: 10,
  },
  FPS: {
    _: true,
    step: 1,
    value: 60,
    min: 1,
    max: 200,
  },
  antColor: '#28bc97',
  restart() {
    generate()
  },
})

// -----------

const ctx = useCanvas()

const grid = new AntGrid()

useFPSRunner(draw, {
  fps: () => option.value.FPS,
})

onMounted(() => {
  generate()
})

function generate() {
  const { width, height } = ctx.canvas
  const { size } = option.value

  grid.w = Math.ceil(width / size)
  grid.h = Math.ceil(height / size)

  grid.clear()

  grid.ant.x = Math.round(grid.w / 2)
  grid.ant.y = Math.round(grid.h / 2)

  // grid.forEach((_, x, y) => {
  //   grid.set(x, y, random() > 0.99 ? 1 : 0)
  // })

  firstDraw()

  drawAnt()
}

function firstDraw() {
  clear(ctx)
  const { size } = option.value
  grid.forEach((value = 0, x, y) => {
    ctx.fillStyle = value === 0 ? 'white' : option.value.color

    ctx.fillRect(x * size, y * size, size, size)
  })
}

function drawAnt() {
  const { size } = option.value

  ctx.fillStyle = option.value.antColor

  const pos = grid.ant
  const x = pos.x * size + size / 2
  const y = pos.y * size + size / 2
  ctx.beginPath()
  ctx.arc(x, y, size / 2, 0, 2 * PI)
  ctx.fill()
}

function drawGridCell(x: number, y: number, value: 0 | 1) {
  grid.set(x, y, value)
  const { size } = option.value

  ctx.fillStyle = value === 0 ? 'white' : option.value.color

  ctx.fillRect(x * size, y * size, size, size)
}

function draw() {
  const s = grid.getAntGround()

  const nextS = s === 1 ? 0 : 1

  drawGridCell(grid.ant.x, grid.ant.y, nextS)

  if (s === 1) {
    grid.dir.rotate(PI / 2)
  } else {
    grid.dir.rotate(-PI / 2)
  }

  grid.ant.add(grid.dir)
  drawAnt()
}
</script>

<template>
  <Layout title="Langton's ant">
    <div :ref="ctx.ref" class="w-full h-full"></div>
  </Layout>
</template>

<style lang="less" scoped></style>
