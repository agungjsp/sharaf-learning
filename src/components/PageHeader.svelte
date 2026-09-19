<script lang="ts">
  import type { Snippet } from 'svelte';
  let { title, description, aside }: { title: string; description?: string; aside?: Snippet } = $props();
</script>

<header class="mb-7 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-start sm:justify-between">
  <div class="max-w-3xl">
    <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
    {#if description}<p class="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>{/if}
  </div>
  {#if aside}<div class="shrink-0">{@render aside()}</div>{/if}
</header>
