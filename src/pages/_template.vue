<script lang="ts" setup>
import Layout from '@/components/Layout.vue'
import { clear, useCanvas } from '@/canvas'
import { Random } from '@/math'
import { useOptionGUI, useRafStats } from '@/hooks'

// ______________

const option = useOptionGUI({
  color: '#f26f6f',
})

// -----------

const ctx = useCanvas()

const random = Random()

useRafStats(() => {
  clear(ctx)

  ctx.strokeStyle = option.value.color

  ctx.beginPath()

  // todo

  ctx.stroke()
})

function reset() {
  //
}
</script>

<template>
  <Layout title="title">
    <div :ref="ctx.ref" class="w-full h-full"></div>
  </Layout>
</template>

<style lang="less" scoped></style>
