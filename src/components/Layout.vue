<script lang="ts" setup>
defineProps<{
  title: string
}>()

defineEmits<{
  reset(): void
}>()
</script>

<template>
  <div class="p-10">
    <div class="text-center text-2xl">
      <slot name="title"> {{ title }}</slot>
    </div>
    <div class="my-4">
      <slot></slot>
    </div>
    <div class="text-center">
      <button @click="$emit('reset')">Reset</button>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
