<script lang="ts">
  import BookOpen from '@lucide/svelte/icons/book-open';
  import type { Lesson } from '../types.ts';
  import Text from '../Text.svelte';
  import SourceReferences from '../SourceReferences.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Sheet from '$lib/components/ui/sheet';

  let { lesson, open = $bindable(false) }: { lesson: Lesson; open?: boolean } = $props();
</script>

<Sheet.Root bind:open>
  <Sheet.Content side="right" class="w-[min(92vw,34rem)] overflow-y-auto p-0 sm:max-w-[34rem]">
    <Sheet.Header class="sticky top-0 z-10 border-b bg-popover px-5 py-5 text-left sm:px-7">
      <Sheet.Title class="flex items-center gap-2 text-lg"><BookOpen class="size-5 text-primary" />Referensi pelajaran</Sheet.Title>
      <Sheet.Description><Text text={lesson.title} scale="ui" /></Sheet.Description>
    </Sheet.Header>
    <div class="space-y-7 px-5 py-6 sm:px-7">
      <section><h3 class="text-sm font-semibold">Inti pembahasan</h3><p class="mt-2 text-sm leading-7 text-muted-foreground"><Text text={lesson.intro} /></p></section>
      <section><h3 class="text-sm font-semibold">Contoh utama</h3><div class="mt-3 divide-y rounded-xl border bg-card px-4">{#each lesson.facts as fact}<div class="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-5"><bdi class="font-arabic text-[length:var(--arabic-size)] leading-loose text-foreground" lang="ar" dir="rtl">{fact.term}</bdi><div><strong class="text-sm font-medium"><Text text={fact.meaning} /></strong><p class="mt-1 text-xs leading-5 text-muted-foreground"><Text text={fact.why} /></p></div></div>{/each}</div></section>
      <SourceReferences {lesson} />
      <Button href={`#reference?lesson=${lesson.id}`} variant="outline" class="h-11 w-full">Buka referensi lengkap</Button>
    </div>
  </Sheet.Content>
</Sheet.Root>
