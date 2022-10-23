<script lang="ts" setup>
import Layout from '@/components/Layout.vue'
import { clear, useCanvas } from '@/canvas'
import { useOptionGUI } from '@/hooks'
import { drawFractal } from '@/canvas/fractal'
import { generatorRunner } from '@/utils'

// ______________

const option = useOptionGUI({
  length: 150,
  factor: 0.5,
  startAngle: -10,
  color: '#ccc',
  limit: {
    len: {
      _: true,
      value: 1,
      min: 0,
    },
    generation: {
      _: true,
      min: 2,
      max: 10,
      value: 6,
      step: 1,
    },
  },
  redraw: () => reset(),
  reset: () => {
    option.reset()
    location.reload()
  },
})

// -----------

const ctx = useCanvas()

const runner = generatorRunner(drawFractal)

async function reset() {
  await runner.current

  clear(ctx)
  runner.reset(ctx, option.value)
}

onMounted(async () => {
  reset()
})
</script>

<template>
  <Layout title="Fractal Tree">
    <div :ref="ctx.ref" class="w-full h-full"></div>
  </Layout>
</template>

<style lang="less" scoped></style>
