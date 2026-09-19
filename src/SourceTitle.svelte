<script lang="ts">
  import { sourceTitle } from './source.ts';
  import Text from './Text.svelte';
  export let title: string;
  $: heading = sourceTitle(title);
</script>

<span class="flex min-w-0 flex-1 items-start gap-3">
  {#if heading.number}<span class="min-w-9 shrink-0 pt-0.5 text-xs font-medium tabular-nums text-muted-foreground" dir="ltr">§ {heading.number}</span>{/if}
  <span class="flex min-w-0 flex-1 flex-col items-start gap-0.5">
    <span class="wrap-anywhere text-sm font-semibold leading-6 text-foreground sm:text-base"><Text text={heading.label} scale="ui" /></span>
    {#if heading.arabic}<bdi class="font-arabic block max-w-full text-xl font-normal leading-9 text-muted-foreground" lang="ar" dir="rtl">{heading.arabic}</bdi>{/if}
  </span>
</span>
