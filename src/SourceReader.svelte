<script lang="ts">
  import { sourceSections, normalizeSearch } from './source.ts';
  import Text from './Text.svelte';
  import SourceTitle from './SourceTitle.svelte';
  import * as Table from '$lib/components/ui/table';
  export let selectedId = '';
  export let search = '';
  export let lessonId = '';
  $: selected = sourceSections.findIndex(s=>s.id === selectedId);
  $: end = selected < 0 ? -1 : sourceSections.findIndex((s,i)=>i>selected && s.level<=sourceSections[selected].level);
  $: sections = sourceSections.filter((section,i) => search.trim()
    ? normalizeSearch([section.title, ...section.blocks.flatMap(block => block.type === 'text' ? [block.text] : [...block.headers, ...block.rows.flat()])].join(' ')).includes(normalizeSearch(search))
    : selected < 0 || (i>=selected && (end<0 || i<end)));
</script>
<section class="mt-8">
  <div class="mb-5">
    <h2 class="text-xl font-semibold tracking-tight">Kitabut Tashrif</h2>
    <p class="font-arabic mt-1 text-xl leading-8 text-foreground" lang="ar" dir="rtl">كِتَابُ التَّصْرِيفِ</p>
    <p class="mt-1 text-sm leading-6 text-muted-foreground">Sumber utama materi pembelajaran. Pilih bagian untuk membaca transkripsi penjelasan dan tabel kitab.</p>
  </div>
  {#if selectedId}<a class="mb-4 inline-flex min-h-11 items-center text-sm font-medium text-primary hover:underline" href={`#reference?${lessonId ? `lesson=${lessonId}&` : ''}tab=source`}>Lihat semua bagian sumber</a>{/if}
  {#if !sections.length}<p class="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">Tidak ada bagian sumber yang cocok.</p>{/if}
  <div class="divide-y rounded-xl border bg-card px-4 sm:px-5">
  {#each sections as section (section.id)}<details open={!!search.trim() || selected >= 0} id={section.id} class="group py-1">
    <summary class="flex min-h-14 cursor-pointer list-none items-start gap-3 py-3 marker:hidden"><span aria-hidden="true" class="mt-2.5 size-2 shrink-0 rotate-[-45deg] border-b border-r border-muted-foreground transition-transform group-open:rotate-45"></span><h3 class="min-w-0 flex-1"><SourceTitle title={section.title} /></h3></summary>
    <a class="mb-3 inline-flex min-h-11 items-center text-xs font-medium text-primary hover:underline" href={`#reference?${lessonId ? `lesson=${lessonId}&` : ''}section=${section.id}&tab=source`}>Tautan langsung ke bagian ini</a>
    {#each section.blocks as block}
      {#if block.type === 'table'}
        <!-- svelte-ignore a11y_no_noninteractive_tabindex (scrollable tables must be reachable with a keyboard) -->
        <div class="table-scroll mb-4 overflow-x-auto rounded-lg border" role="region" aria-label={section.title} tabindex="0">
          <Table.Root class="min-w-[38rem]"><Table.Header><Table.Row>{#each block.headers as header}<Table.Head><Text text={header} /></Table.Head>{/each}</Table.Row></Table.Header><Table.Body>{#each block.rows as row}<Table.Row>{#each row as cell}<Table.Cell class="align-top leading-7"><Text text={cell} /></Table.Cell>{/each}</Table.Row>{/each}</Table.Body></Table.Root>
        </div>
      {:else}<p class="mb-4 max-w-[70ch] whitespace-pre-line text-sm leading-7 text-muted-foreground"><Text text={block.text} /></p>{/if}
    {/each}
  </details>{/each}
  </div>
</section>
