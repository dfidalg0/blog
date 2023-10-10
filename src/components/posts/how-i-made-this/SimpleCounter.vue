<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue';
import { createDomLogger } from '@/utils/dom';

const count = ref(0);

onMounted(() => {
  const logger = createDomLogger('.component-logs');
  logger.log('Vue SimpleCounter is interactive');
  watchEffect(() => logger.log(`Vue count is ${count.value}`));
});
</script>

<template>
  <div class="my-10 flex items-center gap-5 justify-center">
    <button
      class="btn"
      :disabled="count <= 0"
      @click="--count"
    >-</button>
    <div>
      {{ count }}
    </div>
    <button
      class="btn"
      @click="++count"
    >+</button>
  </div>
</template>

<style scoped lang="scss">
.btn {
  @apply
    dark:bg-red-950
    bg-red-600
    text-white
    flex
    items-center
    disabled:opacity-30
    justify-center
    text-2xl
    h-10
    aspect-square
    rounded-full
    select-none;
}
</style>
