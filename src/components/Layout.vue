<script lang="ts" setup>
defineProps<{
  title: string
}>()

defineEmits<{
  reset(): void
}>()
</script>

<template>
  <div class="w-screen h-screen flex flex-col">
    <div class="text-center text-2xl py-4 border-b border-gray-200">
      <slot name="title"> {{ title }}</slot>
    </div>
    <div class="flex-1">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
