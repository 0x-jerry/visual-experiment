<script lang="ts" setup>
import Preview from '@/components/Preview.vue'
//
const pages = [
  {
    title: 'Random Count',
    path: '/random',
  },
  {
    title: 'Fractal Tree',
    path: '/fractal-tree',
  },
  {
    title: "Conway's Game of Life",
    path: '/game-of-life',
  },
]
</script>

<template>
  <div class="">
    <div class="px-10 py-2 text-xl border-b border-gray-200">Try some cool things using canvas</div>

    <div class="flex flex-wrap gap-6 px-10 py-2">
      <preview v-for="o in pages" v-bind="o"></preview>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
