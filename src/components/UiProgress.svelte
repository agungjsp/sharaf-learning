<script lang="ts">
  let { value, max, label, class: className = '' }: { value: number; max: number; label: string; class?: string } = $props();
  let percent = $derived(max > 0 ? Math.min(100, Math.max(0, value / max * 100)) : 0);
</script>

<div class={`h-2 w-full overflow-hidden rounded-full bg-muted ${className}`} role="progressbar" aria-label={label} aria-valuemin="0" aria-valuemax={max} aria-valuenow={value}>
  <div class="h-full rounded-full bg-primary transition-[width]" style:width={`${percent}%`}></div>
</div>
