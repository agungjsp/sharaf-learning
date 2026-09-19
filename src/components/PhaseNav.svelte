<script lang="ts">
  import BookOpen from '@lucide/svelte/icons/book-open';
  import Brain from '@lucide/svelte/icons/brain';
  import ClipboardCheck from '@lucide/svelte/icons/clipboard-check';
  import Check from '@lucide/svelte/icons/check';
  import { cn } from '$lib/utils';
  export type LearningPhase = 'material' | 'practice' | 'check';
  let { phase, practiceReady, checkReady, onphase }: { phase: LearningPhase; practiceReady: boolean; checkReady: boolean; onphase: (phase: LearningPhase) => void } = $props();
  const phases = [
    { id: 'material' as const, label: 'Materi', icon: BookOpen },
    { id: 'practice' as const, label: 'Latihan', icon: Brain },
    { id: 'check' as const, label: 'Cek', icon: ClipboardCheck },
  ];
  const enabled = (id: LearningPhase) => id === 'material' || (id === 'practice' && practiceReady) || (id === 'check' && checkReady);
  const complete = (id: LearningPhase) => id === 'material' ? phase !== 'material' : id === 'practice' ? phase === 'check' : false;
</script>

<nav aria-label="Fase pelajaran" class="mb-6 rounded-xl border bg-card p-1.5 sm:mb-8">
  <ol class="grid grid-cols-3 gap-1">
    {#each phases as item, index}
      {@const Icon = item.icon}
      <li>
        <button type="button" disabled={!enabled(item.id)} aria-current={phase === item.id ? 'step' : undefined} onclick={() => onphase(item.id)} class={cn('flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-2 text-xs font-medium transition-colors sm:text-sm', phase === item.id ? 'bg-primary text-primary-foreground' : enabled(item.id) ? 'text-muted-foreground hover:bg-muted hover:text-foreground' : 'cursor-not-allowed text-muted-foreground/50')}>
          {#if complete(item.id)}<Check class="size-4" />{:else}<Icon class="size-4" />{/if}<span>{index + 1}. {item.label}</span>
        </button>
      </li>
    {/each}
  </ol>
</nav>
