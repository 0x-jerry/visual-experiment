<script lang="ts" setup>
import { useCanvas } from '@/canvas/hook'
import { mapRange, Random } from '@/math'
import { useDatGUI, useRafStats, useStats } from '@/hooks'

// ______________

const option = reactive({
  speed: {
    _: true,
    min: 10,
    max: 1000,
    step: 1,
    value: 100,
  },
})

useDatGUI(option)

// -----------

const root = ref<HTMLElement>()

const ctx = useCanvas(root)

const items: number[] = []

const drawLine = (x: number, value: number) => {
  ctx.moveTo(x, 0)
  ctx.lineTo(x, value)
  ctx.fill()
}

const clear = () => {
  const w = ctx.canvas.width
  const h = ctx.canvas.height

  ctx.fillStyle = '#fff'
  ctx.clearRect(0, 0, w, h)
}

const random = Random()

const getRandomValue = () => {
  const w = ctx.canvas.width

  let value = random()

  value = Math.round(mapRange(value, 0, w))

  items[value] ||= 0
  items[value] += 1
}

useRafStats(() => {
  for (let idx = 0; idx < option.speed.value; idx++) {
    getRandomValue()
  }

  clear()

  ctx.beginPath()

  items.forEach((value, idx) => {
    drawLine(idx, value || 0)
  })

  ctx.strokeStyle = '#ddd'
  ctx.stroke()
})
</script>

<template>
  <div class="p-10">
    <div class="text-center text-2xl my-4">First Example</div>
    <div
      ref="root"
      class="w-600px m-auto border border-gray-200"
      style="aspect-ratio: 16 / 9"
    ></div>
  </div>
</template>

<style lang="less" scoped></style>
