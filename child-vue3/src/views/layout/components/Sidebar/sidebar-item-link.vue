<script setup lang="ts">
import { isExternal } from '@/utils/validate'

const props = defineProps<{
  to: string
}>()
</script>

<template>
  <a v-if="isExternal(props.to)" :href="props.to" target="_blank" rel="noopener">
    <slot></slot>
  </a>
  <router-link v-else :to="props.to">
    <slot></slot>
  </router-link>
</template>
