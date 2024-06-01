<script lang="ts" setup>
import Layout from '@/components/Layout.vue'
import { clear, useCanvas } from '@/canvas'
import { Random } from '@/math'
import { useOptionGUI } from '@/hooks'
import { useFPSRunner } from '@/hooks/useFPSRunner'

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

const ctx = useCanvas()

const random = Random()

useFPSRunner(draw, {
  fps: () => option.value.FPS,
})

function draw() {
  // todo
}
</script>

<template>
  <Layout title="title">
    <div :ref="ctx.ref" class="w-full h-full"></div>
  </Layout>
</template>

<style lang="less" scoped></style>
