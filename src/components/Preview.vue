<script lang="ts" setup>
defineProps<{
  title: string
  path: string
}>()

function getPath(p: string) {
  return location.pathname + '#' + p
}

const size = {
  w: 1920,
  h: 1080,
}

const targetSize = {
  w: 400,
  h: (400 / size.w) * size.h,
}

const scale = targetSize.w / size.w
</script>

<template>
  <div
    class="transition transition-shadow shadow-lg hover:shadow-xl cursor-pointer"
    @click="$router.push(path)"
  >
    <div class="border-b border-gray-200 px-4 py-1 text-xl">
      {{ title }}
    </div>

    <div
      class="pointer-events-none"
      :style="{ width: targetSize.w + 'px', height: targetSize.h + 'px' }"
    >
      <iframe
        :src="getPath(path)"
        frameborder="0"
        class="w-1920px h-1080px absolute"
        :style="{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }"
      ></iframe>
    </div>
  </div>
</template>

<style lang="less"></style>
