<script lang="ts" setup>
defineProps<{
  title: string
  path: string
}>()

function getPath(p: string) {
  const u = new URL(p, location.origin)
  u.searchParams.set('autoStart', '0')

  return location.pathname + '#' + u.pathname + u.search
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

const iframeStyle = computed(() => {
  return {
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
  }
})
</script>

<template>
  <div class="transition transition-shadow shadow-lg hover:shadow-xl cursor-pointer" @click="$router.push(path)">
    <div class="border-b border-gray-200 px-4 py-1 text-xl hover:text-blue-5">
      {{ title }}
    </div>

    <div class="relative" :style="{ width: targetSize.w + 'px', height: targetSize.h + 'px' }">
      <iframe :src="getPath(path)" frameborder="0" class="w-1920px h-1080px absolute" :style="iframeStyle" />
      <div class="absolute w-full h-full cursor-pointer pointer-events-none"></div>
    </div>
  </div>
</template>

<style lang="less"></style>
