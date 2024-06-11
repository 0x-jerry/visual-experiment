<script lang="ts" setup>
import Layout from '@/components/Layout.vue'
import { useCanvasRunner, useOptionGUI } from '@/hooks'
import { drawAStar } from '@/canvas/aStar'

// ______________

const option = useOptionGUI({
  color: '#ffffff',
  obstacleColor: '#f26f6f',
})

// -----------

const runner = useCanvasRunner((ctx) => {
  const _conf = option.value

  return drawAStar(ctx, _conf)
})
</script>

<template>
  <Layout title="title">
    <div :ref="runner.ctx.ref" class="w-full h-full"></div>
  </Layout>
</template>

<style lang="less" scoped></style>
