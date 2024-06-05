<script lang="ts" setup>
import Layout from '@/components/Layout.vue'
import { clear, useCanvas } from '@/canvas'
import { useCanvasRunner, useOptionGUI } from '@/hooks'
import { useFPSRunner } from '@/hooks/useFPSRunner'
import { drawMaze } from '@/canvas/maze'

// ______________

const option = useOptionGUI({
  color: '#ffffff',
  wallColor: '#6fbbdb',
  x: {
    _: true,
    min: 10,
    max: 100,
    value: 50,
    step: 1,
  },
  y: {
    _: true,
    min: 10,
    max: 100,
    value: 30,
    step: 1,
  },
  redraw: () => reset(),
})

// -----------

const runner = useCanvasRunner(ctx => {
  clear(ctx)
  const opt = option.value

  return drawMaze(ctx, {
    color: opt.color,
    wallColor: opt.wallColor,
    size: { x: opt.x, y: opt.y },
  })
})

runner.emitter.on('done', () => {
  console.log('done')
})

async function reset() {
  runner.restart()
}
</script>

<template>
  <Layout title="Maze Generator">
    <div :ref="runner.ctx.ref" class="w-full h-full"></div>
  </Layout>
</template>

<style lang="less" scoped></style>
