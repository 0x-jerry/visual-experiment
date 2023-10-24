<script lang="ts" setup>
import Preview from '@/components/Preview.vue'
const pages = [
  {
    title: 'Pseudo Random Distribution',
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
  {
    title: "Langton's Ant",
    path: '/langton-ant',
  },
]
</script>

<template>
  <div class="">
    <div class="px-10 py-2 text-xl border-b border-gray-200 flex items-end gap-2">
      Try some cool things using canvas
      <small class="text-gray-5 text-sm">Hover to see the animation </small>
      <div class="flex flex-1 justify-end items-center">
        <a
          href="https://github.com/0x-jerry/visual-experiment"
          target="_blank"
          class="text-gray-4 hover:text-gray-8 transition transition-colors"
        >
          <i-bxl-github />
        </a>
      </div>
    </div>
    <hr class="b-(solid gray-1)" />

    <div class="flex flex-wrap gap-6 px-10 py-2 justify-between cursor-pointer">
      <preview v-for="o in pages" v-bind="o"></preview>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
