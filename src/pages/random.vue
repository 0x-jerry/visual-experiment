<script lang="ts" setup>
import { clear, useCanvas } from '@/canvas'
import { mapRange, Random } from '@/math'
import { useDatGUI, useRafStats } from '@/hooks'

// ______________

const option = useDatGUI({
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
  color: {
    _: 'color',
    value: '#f26f6f',
  },
})

// -----------

const ctx = useCanvas()

const lines: number[] = []

const drawLine = (x: number, value: number) => {
  ctx.moveTo(x, 0)
  ctx.lineTo(x, value)
}

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
    drawLine(idx, value || 0)
  })

  ctx.stroke()
})

function reset() {
  lines.splice(0)
}
</script>

<template>
  <div class="p-10">
    <div class="text-center text-2xl my-4">Pseudo Random Distribution</div>
    <div
      :ref="ctx.ref"
      class="w-600px m-auto border border-gray-200"
      style="aspect-ratio: 16 / 9"
    ></div>
    <div class="mt-4 text-center">
      <button @click="reset">Reset</button>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
