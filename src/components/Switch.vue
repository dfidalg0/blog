<script setup lang="ts">
import { ref, onMounted, watch, reactive } from 'vue';
import { ModalController } from '../utils/modal-controller';

const props = defineProps<{
  slots: Array<{
    id: string;
    label: string;
  }>;
  noPadding?: boolean;
}>();

const rootRef = ref<HTMLDivElement>();
const selectorRef = ref<HTMLDivElement>();
const sliderRef = ref<HTMLDivElement>();

const $slots = defineSlots();

const slotsSpec = props.slots.filter((slot) => slot.id in $slots);
const options = slotsSpec.map((s) => s.id);

const currentIndex = ref(0);

interface ModalState {
  shouldOpen: boolean;
  controller: ModalController;
}

const items: HTMLDivElement[] = reactive([]);

onMounted(() => {
  const root = rootRef.value!;
  const selector = selectorRef.value!;

  const modalsMap = new WeakMap<HTMLDivElement, ModalState[]>();

  for (const item of items) {
    modalsMap.set(
      item,
      ModalController.findFrom(item).map((c) => ({
        controller: c,
        shouldOpen: c.isOpen(),
      }))
    );
  }

  watch(currentIndex, (index, prevIndex) => {
    root.style.setProperty('--switch-transform', index.toString());

    const tab = root.querySelector<HTMLButtonElement>(
      `.switch__tab:nth-child(${index + 1})`
    )!;

    selector.style.setProperty('--slider-translate', `${tab.offsetLeft}px`);
    selector.style.setProperty('--slider-size', `${tab.clientWidth}px`);


    const currentItem = items[index]!;

    modalsMap.get(currentItem)!.forEach((modal) => {
      if (modal.shouldOpen) modal.controller.open();
    });

    if (prevIndex === undefined) return;

    const prevItem = items[prevIndex]!;

    modalsMap.get(prevItem)!.forEach((modal) => {
      const isOpen = modal.controller.isOpen();

      // if we are the ones closing the modal, we should reopen it when it comes
      // back into view
      modal.shouldOpen = isOpen;

      if (isOpen) modal.controller.close();
    });
  }, { immediate: true });
});

function setTab(id: string) {
  const index = options.indexOf(id);

  if (index === -1) return;

  currentIndex.value = index;
}
</script>

<template>
  <div class="switch" :class="{ noPadding }" ref="rootRef">
    <div class="switch__selector" ref="selectorRef">
      <button
        v-for="{ id, label } in slotsSpec"
        :key="id"
        :data-id="id"
        class="switch__tab"
        @click="setTab(id)"
      >
        {{ label }}
      </button>
    </div>
    <div class="switch__slider" ref="sliderRef">
      <div
        v-for="{ id }, idx in slotsSpec"
        :key="id"
        class="switch__item"
        :ref="(el) => items[idx] = el as HTMLDivElement"
      >
        <slot :name="id" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.switch {
  @apply w-full h-full overflow-x-hidden;

  $transition-duration: .15s;

  --padding: .75rem 1rem;

  &.noPadding {
    --padding: none;
  }

  position: relative;

  &__selector {
    position: relative;

    &::before {
      $height: 2px;

      content: '';
      position: absolute;
      background: red;
      height: $height;
      bottom: -$height;
      left: 0px;
      transform: translateX(var(--slider-translate));
      width: var(--slider-size);
      z-index: 2;

      transition: transform $transition-duration ease;
    }
  }

  &__slider {
    @apply max-w-full relative;

    display: flex;
    transition: transform $transition-duration ease;
    transform: translateX(calc(var(--switch-transform, 0) * -100%));
  }

  &__tab {
    cursor: pointer;
    appearance: unset;
    border: unset;
    background: transparent;
    padding: 8px 10px;
    min-width: 50px;
    color: white;
    mix-blend-mode: difference;
    font-size: .95rem;
  }

  &__item {
    @apply bg-gray-200 dark:bg-gray-900;

    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    flex-shrink: 0;
    padding: var(--padding);
  }
}
</style>
