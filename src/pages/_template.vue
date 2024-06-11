<script lang="ts" setup>
import Layout from '@/components/Layout.vue'
import { useCanvasRunner, useOptionGUI } from '@/hooks'
import { clear } from '@/canvas'

// ______________

const option = useOptionGUI({
  color: '#f26f6f',
  FPS: {
    _: true,
    step: 1,
    value: 24,
    min: 8,
    max: 60,
  },
})

// -----------

const runner = useCanvasRunner(
  (ctx) => {
    clear(ctx)
    // todo
  },
  {
    fps: () => option.value.FPS,
  },
)
</script>

<template>
  <Layout title="title">
    <div :ref="runner.ctx.ref" class="w-full h-full"></div>
  </Layout>
</template>

<style lang="less" scoped></style>
