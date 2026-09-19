<script lang="ts">
  export let text: string;
  export let scale: 'reading' | 'ui' = 'reading';
  $: parts = text.split(/([\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]+(?:[ \u00a0]+[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]+)*)/u);
</script>
{#each parts as part}{#if /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]/u.test(part)}<bdi class="ar-inline" class:ar-ui={scale === 'ui'} lang="ar" dir="rtl">{part}</bdi>{:else}{part}{/if}{/each}
