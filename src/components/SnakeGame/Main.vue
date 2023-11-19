<script setup="setup" lang="ts">
import { onMounted, ref } from 'vue';
import N404 from './N404.vue';
import Snake, { type Controller } from './Snake.vue';

defineOptions({
  name: 'SnakeGame',
});

const play = ref(false);

const isTouch = ref(false);

onMounted(() => {
  const media = window.matchMedia('(any-pointer: coarse)');

  const saveMedia = () => isTouch.value = media.matches;
  saveMedia();
  media.onchange = saveMedia;
});


const controls = ref<Controller>();

function handleLose() {
  setTimeout(() => {
    play.value = false;
    controls.value = undefined;
  }, 800);
}
</script>

<template>
  <svg viewBox="0 0 50 50" class="h-0 w-full p-5 flex-grow root">
    <snake v-if="play" @lose="handleLose" @controls="controls = $event"/>
    <n-404 v-else @click="play = true" />
  </svg>
  <div v-if="isTouch && controls" id="game-controls">
    <button
      v-for="dir in (['anticlockwise', 'clockwise'] as const)"
      :key="dir"
      class="text-red-500 bg-white w-full h-full control"
      @touchstart="controls[dir]()"
      :style="{ gridArea: dir }"
    >
      {{ dir === 'clockwise' ? '↻' : '⟲' }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.root {
  @apply stroke-font fill-none border-font;
  stroke-linecap: square;
  stroke-width: 1;
  overflow: visible;
}

.control {
  display: flex;
  height: 100%;
}

#game-controls {
  $size: 120px;

  @at-root {
    .control {
      display: flex;
      height: 100%;
      justify-content: center;
      align-items: center;
      font-size: $size * 0.6;
      padding: 0;
    }
  }

  position: relative;

  padding: 1rem;
  width: 100vw;
  height: $size;
  position: fixed;
  bottom: 0;
  display: flex;
  gap: 2rem;
}
</style>
