<script lang="ts" setup>
import Layout from '@/components/Layout.vue'
import { clear, useCanvas } from '@/canvas'
import { Random } from '@/math'
import { useOptionGUI, useRafStats } from '@/hooks'
import dayjs from 'dayjs'
import { drawFractal } from '@/canvas/fractal'

// ______________

const option = useOptionGUI({
  color: '#f26f6f',
  iterCount: {
    _: true,
    value: 5,
    step: 1,
    min: 0,
    max: 5,
  },
  length: 50,
  dumping: 0.6,
  reset,
})

// -----------

const ctx = useCanvas()

const random = Random()

interface TreeNode {
  len: number

  children?: TreeNode[]
}

const treeRoot: TreeNode = {
  len: option.value.length,
}

function generate() {
  treeRoot.len = option.value.length

  treeRoot.children = []
  generateTreeData(treeRoot)
}

watch(
  () => option.value,
  () => {
    generate()
  },
  {
    immediate: true,
  },
)

function generateTreeData(parent: TreeNode, iterCount = option.value.iterCount) {
  if (iterCount <= 0) {
    return
  }

  const nextIter = iterCount - 1

  const factor = option.value.dumping

  parent.children = [
    {
      len: parent.len * factor,
    },
    {
      len: parent.len * factor,
    },
  ]

  for (const item of parent.children) {
    generateTreeData(item, nextIter)
  }
}

function update() {
  const { width, height } = ctx.canvas

  const center = {
    x: width / 2,
    y: height / 2,
  }

  drawClock2(center.x, center.y)
}

const { PI } = Math

function drawClock2(x: number, y: number) {
  const time = dayjs()
  const h = time.hour()
  const m = time.minute()
  const s = time.second()
  const start = -PI / 2

  drawClock(x, y, treeRoot, start)

  function drawClock(x: number, y: number, node: TreeNode, startAngle: number) {
    const len = node.len

    drawLine((s / 60) * 2 * PI, len)

    drawLine((m / 60) * 2 * PI, len * (4 / 5))

    drawLine((h / 12) * 2 * PI, len * (1 / 2))

    function drawLine(angle: number, len: number) {
      const dx = len * Math.cos(startAngle + angle)
      const dy = len * Math.sin(startAngle + angle)

      ctx.moveTo(x, y)
      ctx.lineTo(x + dx, y + dy)

      for (const item of node.children || []) {
        drawClock(x + dx, y + dy, item, startAngle + PI / 4)
      }
    }
  }
}

onMounted(() => {
  drawFractal(ctx, {
    length: 150,
    factor: 0.5,
    startAngle: -10,
    color: '#ccc',
    limit: {
      len: 1,
      generation: 8,
    },
  }).then(() => {
    console.log('done')
  })
})

onUnmounted(() => {
  clear(ctx)
})

function reset() {
  option.reset()
  location.reload()
  //
}
</script>

<template>
  <Layout title="Simple Tree">
    <div :ref="ctx.ref" class="w-full h-full"></div>
  </Layout>
</template>

<style lang="less" scoped></style>
