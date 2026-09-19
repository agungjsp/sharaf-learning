<script lang="ts">
  import type { Snippet } from 'svelte';
  import House from '@lucide/svelte/icons/house';
  import BookOpen from '@lucide/svelte/icons/book-open';
  import Brain from '@lucide/svelte/icons/brain';
  import Library from '@lucide/svelte/icons/library';
  import Chart from '@lucide/svelte/icons/chart-no-axes-column-increasing';
  import Settings from '@lucide/svelte/icons/settings';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { cn } from '$lib/utils';

  let {
    route,
    due,
    pageTitle,
    onskip,
    children,
  }: {
    route: string;
    due: number;
    pageTitle: string;
    onskip: () => void;
    children: Snippet;
  } = $props();

  const linkClass = 'flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/25';
  const bottomClass = 'relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[0.68rem] font-medium text-muted-foreground transition-colors hover:text-foreground';
  const activeClass = 'bg-accent text-accent-foreground';
  const activeBottomClass = 'text-primary before:absolute before:inset-x-5 before:top-0 before:h-0.5 before:rounded-full before:bg-primary';
  const isActive = (name: string) => name === 'materials' ? route === 'materials' || route === 'lesson' : name === 'practice' ? route === 'review' || route === 'mixed' : route === name;
</script>

<div class="min-h-dvh bg-background text-foreground">
  <a href="#main" class="fixed left-3 top-3 z-[100] -translate-y-24 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform focus:translate-y-0" onclick={(event) => { event.preventDefault(); onskip(); }}>Langsung ke konten</a>

  <aside class="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r bg-card px-4 py-5 lg:flex">
    <a href="#today" class="mb-8 flex min-h-11 items-center gap-3 rounded-lg px-2 focus-visible:ring-3 focus-visible:ring-ring/25">
      <img src="./favicon.svg" alt="" class="size-9 rounded-lg bg-primary p-1.5" />
      <span class="min-w-0"><strong class="block text-base font-semibold tracking-tight">Sharaf</strong><small class="block truncate text-xs text-muted-foreground">Ruang belajar pribadi</small></span>
    </a>
    <nav aria-label="Navigasi utama" class="space-y-1">
      <a class={cn(linkClass, isActive('today') && activeClass)} aria-current={isActive('today') ? 'page' : undefined} href="#today"><House class="size-4.5" />Beranda</a>
      <a class={cn(linkClass, isActive('materials') && activeClass)} aria-current={isActive('materials') ? 'page' : undefined} href="#materials"><BookOpen class="size-4.5" />Materi</a>
      <a class={cn(linkClass, isActive('practice') && activeClass)} aria-current={isActive('practice') ? 'page' : undefined} href="#review"><Brain class="size-4.5" /><span class="flex-1">Latihan</span>{#if due}<Badge variant="secondary" class="min-w-6 justify-center px-1.5">{due}</Badge>{/if}</a>
      <a class={cn(linkClass, isActive('reference') && activeClass)} aria-current={isActive('reference') ? 'page' : undefined} href="#reference"><Library class="size-4.5" />Referensi</a>
      <a class={cn(linkClass, isActive('progress') && activeClass)} aria-current={isActive('progress') ? 'page' : undefined} href="#progress"><Chart class="size-4.5" />Progres</a>
    </nav>
    <div class="mt-auto border-t pt-4">
      <a class={cn(linkClass, isActive('settings') && activeClass)} aria-current={isActive('settings') ? 'page' : undefined} href="#settings"><Settings class="size-4.5" />Pengaturan</a>
      <p class="px-3 pt-4 text-xs leading-5 text-muted-foreground">Progres tersimpan di browser ini.</p>
    </div>
  </aside>

  <div class="lg:pl-60">
    <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6 lg:px-8">
      <div><span class="text-sm font-semibold lg:text-base">{pageTitle}</span><span class="ml-2 hidden text-xs text-muted-foreground sm:inline">Pribadi · di perangkat ini</span></div>
      <Button href="#settings" variant="ghost" size="icon" class="size-11 lg:hidden" aria-label="Buka pengaturan"><Settings class="size-5" /></Button>
    </header>
    <main id="main" tabindex="-1" class="mx-auto min-h-[calc(100dvh-4rem)] w-full max-w-7xl px-4 pb-28 pt-6 focus:outline-none sm:px-6 sm:pt-8 lg:px-8 lg:pb-12">
      {@render children()}
    </main>
  </div>

  <nav aria-label="Navigasi utama" class="fixed inset-x-0 bottom-0 z-50 border-t bg-card/98 px-2 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur lg:hidden">
    <div class="mx-auto flex max-w-lg">
      <a class={cn(bottomClass, isActive('today') && activeBottomClass)} aria-current={isActive('today') ? 'page' : undefined} href="#today"><House class="size-5" />Beranda</a>
      <a class={cn(bottomClass, isActive('materials') && activeBottomClass)} aria-current={isActive('materials') ? 'page' : undefined} href="#materials"><BookOpen class="size-5" />Materi</a>
      <a class={cn(bottomClass, isActive('practice') && activeBottomClass)} aria-current={isActive('practice') ? 'page' : undefined} href="#review"><span class="relative"><Brain class="size-5" />{#if due}<span class="absolute -right-2.5 -top-2 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[0.6rem] leading-4 text-primary-foreground">{due}</span>{/if}</span>Latihan</a>
      <a class={cn(bottomClass, isActive('reference') && activeBottomClass)} aria-current={isActive('reference') ? 'page' : undefined} href="#reference"><Library class="size-5" />Referensi</a>
      <a class={cn(bottomClass, isActive('progress') && activeBottomClass)} aria-current={isActive('progress') ? 'page' : undefined} href="#progress"><Chart class="size-5" />Progres</a>
    </div>
  </nav>
</div>
