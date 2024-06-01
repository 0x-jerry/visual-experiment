<script lang="ts" setup>
import { isInIframe } from '@/utils'

defineProps<{
  title: string
}>()

defineEmits<{
  reset: []
}>()
</script>

<template>
  <div class="w-screen h-screen flex flex-col">
    <div
      v-if="!isInIframe"
      class="text-2xl py-4 border-b border-gray-200 flex items-center justify-center gap-2"
    >
      <i-carbon-arrow-left
        class="cursor-pointer text-blue"
        title="Go back"
        @click="$router.push('/')"
      />
      <slot name="title"> {{ title }}</slot>
    </div>
    <div class="flex-1">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
