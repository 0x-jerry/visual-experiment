<script lang="ts" setup>
import Layout from '@/components/Layout.vue'
import { clear, useCanvas } from '@/canvas'
import { mapRange, Random } from '@/math'
import { useOptionGUI, useRafStats } from '@/hooks'

// ______________

const option = useOptionGUI({
  speed: {
    _: true,
    min: 10,
    max: 1000,
    step: 1,
    value: 10,
  },
  stepSize: {
    _: true,
    min: 1,
    max: 20,
    step: 1,
    value: 3,
  },
  color: '#f26f6f',
  reset() {
    lines.splice(0)
  },
})

// -----------

const ctx = useCanvas()

const lines: number[] = []

const random = Random()

const getRandomValue = () => {
  const w = ctx.canvas.width

  let value = random()

  value = Math.round(mapRange(value, 0, w))

  lines[value] ||= 0
  lines[value] += option.value.stepSize
}

useRafStats(() => {
  for (let idx = 0; idx < option.value.speed; idx++) {
    getRandomValue()
  }

  clear(ctx)

  ctx.strokeStyle = option.value.color

  ctx.beginPath()

  lines.forEach((value, idx) => {
    const x = idx
    ctx.moveTo(x, 0)
    ctx.lineTo(x, value)
  })

  ctx.stroke()
})

function reset() {
  lines.splice(0)
}
</script>

<template>
  <Layout title="Pseudo Random Distribution" @reset="reset">
    <div :ref="ctx.ref" class="w-full h-full"></div>
  </Layout>
</template>

<style lang="less" scoped></style>
