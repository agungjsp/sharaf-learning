<script lang="ts">
  import type { Question } from './types.ts';
  import Text from './Text.svelte';
  import * as Table from '$lib/components/ui/table';
  export let question: Question;
  export let answer = '';
  export let disabled = false;
  export let onanswer: (value: string) => void;
</script>
<fieldset class="min-w-0">
  <legend class="mb-5 block w-full text-base font-semibold leading-7 sm:text-lg"><Text text={question.prompt} /> {#if question.required}<span class="ml-2 inline-flex rounded-md bg-accent px-2 py-0.5 align-middle text-[0.7rem] font-semibold text-accent-foreground">Konsep wajib</span>{/if}</legend>
  {#if question.context}
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (scrollable tables must be reachable with a keyboard) -->
    <div class="table-scroll mb-5 overflow-x-auto rounded-lg border" role="region" aria-label="Konteks soal" tabindex="0">
      <Table.Root class="min-w-[32rem]">
        <Table.Header><Table.Row>{#each question.context.headers as header}<Table.Head><Text text={header} /></Table.Head>{/each}</Table.Row></Table.Header>
        <Table.Body><Table.Row>{#each question.context.cells as cell}<Table.Cell><Text text={cell} /></Table.Cell>{/each}</Table.Row></Table.Body>
      </Table.Root>
    </div>
  {/if}
  <div class="grid gap-3">
    {#each question.options as option, index}
      <label class="group flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border bg-card px-4 py-3 text-sm leading-6 transition-colors hover:border-primary/40 hover:bg-accent/50 has-[:checked]:border-primary has-[:checked]:bg-accent has-[:disabled]:cursor-default has-[:disabled]:opacity-70 has-[:disabled]:hover:border-border has-[:disabled]:hover:bg-card sm:text-base" for={`${question.id}-${index}`}>
        <input class="size-5 shrink-0 accent-primary" type="radio" id={`${question.id}-${index}`} name={question.id} value={option} checked={answer === option} {disabled} onchange={() => onanswer(option)} />
        <span class="min-w-0 flex-1"><Text text={option} /></span>
      </label>
    {/each}
  </div>
</fieldset>
