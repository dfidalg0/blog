<script setup lang="ts">
defineEmits<{
  click: [];
}>()
</script>

<template>
  <g class="n-404">
    <path
      class="stroke-[.5] link stroke-current cursor-pointer fill-transparent"
      d="M 25 20 m -1 -2 l 0 4 l 3 -2 l -3 -2 z"
      @click="$emit('click')"
    />

    <path
      d="
        M 16 27
        l 0 -14
        m 0 8
        l -7 0
        l 0 -8

        M 25 20
        m -4 5
        l 0 -10
        l 1 0
        l 0 -1
        l 1 0
        l 0 -1
        l 4 0
        l 0 1
        l 1 0
        l 0 1
        l 1 0
        l 0 10
        l -1 0
        l 0 1
        l -1 0
        l 0 1
        l -4 0
        l 0 -1
        l -1 0
        l 0 -1
        l -1 0

        M 41 27
        l 0 -14
        m 0 8
        l -7 0
        l 0 -8
      "
    />
  </g>
</template>

<style scoped lang="scss">
.n-404 {
  // stroke-dasharray: 1.5;
  animation: dash 1s linear infinite;
}

// @keyframes dash {
//   to {
//     stroke-dashoffset: 3;
//   }
// }
</style>
