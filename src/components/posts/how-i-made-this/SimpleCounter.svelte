<script lang="ts">
import { onMount } from 'svelte';
import { createDomLogger, type DomLogger } from '@/utils/dom';

let count = 0;
let logger: DomLogger;

onMount(() => {
  logger = createDomLogger('.component-logs');
  logger.log('Svelte SimpleCounter is interactive');
});

$: logger?.log(`Svelte count is ${count}`);
</script>

<div class="my-10 flex items-center gap-5 justify-center">
  <button
    class="btn"
    disabled={count <= 0}
    on:click={() => --count}
  >-</button>
  <div>
    {count}
  </div>
  <button
    class="btn"
    on:click={() => ++count}
  >+</button>
</div>

<style lang="postcss">
.btn {
  @apply
    dark:bg-red-950
    bg-red-600
    text-white
    disabled:opacity-30
    flex
    items-center
    justify-center
    text-2xl
    h-10
    aspect-square
    rounded-full
    select-none;
}
</style>
