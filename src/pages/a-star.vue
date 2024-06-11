<script lang="ts" setup>
import Layout from '@/components/Layout.vue'
import { useCanvasRunner, useOptionGUI } from '@/hooks'
import { drawAStar } from '@/canvas/aStar'

// ______________

const option = useOptionGUI({
  cellSize: {
    _: 'number',
    value: 10,
    step: 1,
    min: 1,
    max: 50,
  },
  FPS: {
    _: 'number',
    step: 1,
    value: 60,
    min: 1,
    max: 120,
  },
})

// -----------

const runner = useCanvasRunner(
  (ctx) => {
    const _conf = option.value

    return drawAStar(ctx, _conf)
  },
  { fps: () => option.value.FPS },
)
</script>

<template>
  <Layout title="A Star">
    <div :ref="runner.ctx.ref" class="w-full h-full"></div>
  </Layout>
</template>

<style lang="less" scoped></style>
