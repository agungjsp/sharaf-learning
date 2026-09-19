<script lang="ts">
  import type { Lesson } from './types.ts';
  import { sourceSections } from './source.ts';
  import SourceTitle from './SourceTitle.svelte';
  import Text from './Text.svelte';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  export let lesson: Lesson;
  $: sections = lesson.sourceIds.flatMap(id => sourceSections.filter(section => section.id === id));
</script>

<section class="mt-7 border-t pt-6" aria-label="Sumber pelajaran">
  <h3 class="text-sm font-semibold">Sumber pelajaran</h3>
  <p class="mb-2 mt-1 text-sm text-muted-foreground">Kitabut Tashrif <span class="font-arabic text-base" lang="ar" dir="rtl">كِتَابُ التَّصْرِيفِ</span></p>
  <ul class="divide-y">
    {#each sections as section (section.id)}
      <li>
        <a href={`#reference?lesson=${lesson.id}&section=${section.id}&tab=source`} class="-mx-2 flex min-h-16 items-center justify-between gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-muted">
          <SourceTitle title={section.title} />
          <span class="flex shrink-0 items-center gap-2 text-xs text-muted-foreground" aria-hidden="true"><span class="hidden sm:inline">Buka</span><ArrowRight class="size-4" /></span>
        </a>
      </li>
    {/each}
  </ul>
  <details class="mt-3 text-sm">
    <summary class="flex min-h-11 cursor-pointer items-center text-muted-foreground hover:text-foreground">Catatan pemeriksaan sumber</summary>
    <dl class="grid gap-4 rounded-lg bg-muted/60 p-4 leading-6">
      <div><dt class="font-semibold text-foreground">Acuan</dt><dd class="mt-1 text-muted-foreground"><Text text={lesson.source} scale="ui" /></dd></div>
      <div><dt class="font-semibold text-foreground">Pemeriksaan materi</dt><dd class="mt-1 text-muted-foreground">{lesson.verification}</dd></div>
    </dl>
    <p class="mt-3 text-xs leading-5 text-muted-foreground">Catatan ini berlaku untuk materi yang diperiksa. Soal tambahan dicocokkan dengan transkripsi.</p>
  </details>
</section>
