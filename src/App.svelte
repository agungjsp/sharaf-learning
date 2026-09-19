<script lang="ts">
  import { onMount } from 'svelte';
  import { sourceText as source, normalizeSearch } from './source.ts';
  import { allQuestions, lessons, modules, questions, shuffle, validateContent } from './content.ts';
  import { backup, cardId, dueCards, finishLesson, freshProgress, isPassed, loadProgress, nextLesson, readBackup, reviewCard, saveProgress, stateFor, STORAGE_KEY, ARCHIVE_KEY, today, activeCards, getCard } from './engine.ts';
  import type { Lesson, Progress, Question } from './types.ts';
  import Text from './Text.svelte';
  import QuestionView from './QuestionView.svelte';
  import SourceReader from './SourceReader.svelte';
  import SourceReferences from './SourceReferences.svelte';
  import AppShell from './components/AppShell.svelte';
  import PageHeader from './components/PageHeader.svelte';
  import PhaseNav, { type LearningPhase } from './components/PhaseNav.svelte';
  import LessonReferenceSheet from './components/LessonReferenceSheet.svelte';
  import UiProgress from './components/UiProgress.svelte';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import BookOpen from '@lucide/svelte/icons/book-open';
  import Brain from '@lucide/svelte/icons/brain';
  import Check from '@lucide/svelte/icons/check';
  import CheckCircle from '@lucide/svelte/icons/circle-check';
  import CircleAlert from '@lucide/svelte/icons/circle-alert';
  import Search from '@lucide/svelte/icons/search';
  import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import * as Card from '$lib/components/ui/card';
  import * as Accordion from '$lib/components/ui/accordion';
  import * as Tabs from '$lib/components/ui/tabs';
  import { Input } from '$lib/components/ui/input';
  import * as Alert from '$lib/components/ui/alert';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';

  type Result = { score: number; passed: boolean; wrong: string[] };
  type ReviewItem = { id: string; correction: boolean };
  type MaterialStatus = 'all' | 'new' | 'learning' | 'mastered' | 'revision';
  validateContent();
  let progress: Progress = freshProgress();
  let ready = false, route = 'today', routeId = '', referenceLessonId = '', sourceSectionId = '';
  let notice = '', storageError = '', protectStoredData = false, storedSnapshot: string | null = null, archivedData = '';
  let day = today();
  let lessonStep = 0, practiceIndex = 0, practiceAnswer = '', practiceChecked = false, recallOpen = false;
  let lessonPhase: LearningPhase = 'material', examIndex = 0, examReview = false, referenceOpen = false;
  let practiceSet: Question[] = [], practiceAnswers: string[] = [];
  let exam: Question[] | null = null, examAnswers: string[] = [], result: Result | null = null;
  let reviewQueue: ReviewItem[] = [], reviewStarted = false, reviewOpen = false, reviewCount = 0;
  let mixedQuestions: Question[] | null = null, mixedAnswers: string[] = [], mixedChecked = false;
  let search = '', pendingBackup: Progress | null = null, importError = '';
  let materialSearch = '', materialStatus: MaterialStatus = 'all', openModules: string[] = ['0'], returnLessonId = '';
  let referenceTab = 'lesson';
  const moduleOrder = [0,1,2,3,4,7,5,6,8];
  $: activeLesson = lessons.find(lesson => lesson.id === routeId);
  $: due = ready ? dueCards(progress, day) : [];
  $: eligibleCards = activeCards(progress);
  $: currentReview = reviewQueue[0];
  $: currentCard = currentReview ? getCard(currentReview.id) : null;
  $: passedCount = lessons.filter(lesson => isPassed(progress, lesson)).length;
  $: referenceLessons = filterLessons(search);
  $: resumeTarget = lessons.find(l=>l.id===progress.lastLesson && !isPassed(progress,l)) ?? nextLesson(progress);
  $: requested = lessons.find(lesson => lesson.id === referenceLessonId);
  $: referenceReturnId = requested?.id ?? progress.lastLesson;
  $: materialLessons = filterMaterialLessons();
  $: examAnswered = examAnswers.filter(Boolean).length;
  $: pageTitle = route === 'today' ? 'Beranda' : route === 'materials' ? 'Materi' : route === 'lesson' ? 'Pelajaran' : route === 'review' || route === 'mixed' ? 'Latihan' : route === 'progress' ? 'Progres' : route === 'reference' ? 'Referensi' : 'Pengaturan';

  onMount(() => {
    try { progress = loadProgress(localStorage); storedSnapshot = localStorage.getItem(STORAGE_KEY); archivedData = localStorage.getItem(ARCHIVE_KEY) ?? ''; }
    catch { storageError = 'Progres tersimpan tidak dapat dibaca atau dicadangkan. Data lama dilindungi; buka Pengaturan untuk mengunduhnya.'; protectStoredData = true; }
    ready = true; readRoute();
    const onHash = () => readRoute(true);
    const updateDay = () => { day = today(); };
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      synchronize();
    };
    const interval = window.setInterval(updateDay, 30_000);
    window.addEventListener('hashchange', onHash); window.addEventListener('storage', onStorage);
    window.addEventListener('focus', updateDay); document.addEventListener('visibilitychange', updateDay);
    return () => {
      clearInterval(interval); window.removeEventListener('hashchange', onHash); window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', updateDay); document.removeEventListener('visibilitychange', updateDay);
    };
  });
  function synchronize() {
    try {
      progress = loadProgress(localStorage); storedSnapshot = localStorage.getItem(STORAGE_KEY);
      protectStoredData = false; storageError = ''; resetSessions(); readRoute();
      notice = 'Progres diperbarui dari tab lain. Sesi yang sesuai dilanjutkan dari data tersimpan.';
    } catch { protectStoredData = true; storageError = 'Data dari tab lain tidak valid. Data tersebut dilindungi; ekspor sesi ini atau pulihkan cadangan.'; }
  }
  function focusMain() {
    requestAnimationFrame(() => {
      const target = route === 'reference' && sourceSectionId ? document.querySelector<HTMLElement>(`#${CSS.escape(sourceSectionId)} summary`) : document.querySelector<HTMLElement>('#main');
      target?.focus();
      if (sourceSectionId && route === 'reference') target?.scrollIntoView({block:'start'});
    });
  }
  function readRoute(focus = false) {
    const [path, query = ''] = (location.hash.slice(1) || 'today').split('?');
    const [nextRoute, nextId = ''] = path.split('/');
    const changed = nextRoute !== route || nextId !== routeId;
    if (changed) { resetTransient(); notice = ''; }
    route = nextRoute; routeId = nextId;
    const params = new URLSearchParams(query); referenceLessonId = params.get('lesson') ?? ''; sourceSectionId = params.get('section') ?? '';
    if (route === 'reference') referenceTab = sourceSectionId || params.get('tab') === 'source' ? 'source' : 'lesson';
    if (route === 'materials' || route === 'lesson') {
      materialSearch = params.get('q') ?? '';
      const nextStatus = params.get('status');
      materialStatus = nextStatus === 'new' || nextStatus === 'learning' || nextStatus === 'mastered' || nextStatus === 'revision' ? nextStatus : 'all';
      const module = params.get('module');
      if (module && moduleOrder.some(item => String(item) === module)) openModules = [module];
      if (route === 'materials') {
        returnLessonId = params.get('lesson') ?? '';
        if (returnLessonId) requestAnimationFrame(() => document.getElementById(`lesson-row-${returnLessonId}`)?.scrollIntoView({ block: 'center' }));
      }
    }
    const lesson = lessons.find(item => item.id === nextId);
    if (route === 'lesson' && lesson) {
      lessonStep = stateFor(progress, lesson).step;
      const draft = progress.drafts[lesson.id];
      if (draft?.revision === lesson.revision) {
        if (draft.mode === 'check') { exam = draft.questions; examAnswers = [...draft.answers]; examIndex = draft.index; lessonStep = 5; lessonPhase = 'check'; }
        else { practiceSet = draft.questions; practiceAnswers = [...draft.answers]; practiceIndex = draft.index; practiceAnswer = draft.answers[draft.index]; practiceChecked = draft.checked; lessonStep = 3; lessonPhase = 'practice'; }
      } else if (progress.lessons[lesson.id] && progress.lessons[lesson.id].revision !== lesson.revision) {
        notice = 'Materi diperbarui. Riwayat kelulusan tetap ada; aktivitas lama dibatalkan dan revisi ini perlu dipelajari serta dicek ulang.';
        lessonPhase = 'material';
      } else if (lessonStep >= 5) lessonPhase = 'check';
      else if (lessonStep >= 3) { lessonPhase = 'practice'; if (lessonStep === 3) { startPractice(lesson); saveActivity(lesson); } }
      else lessonPhase = 'material';
    }
    if (focus) focusMain();
  }
  function resetTransient() {
    exam = null; result = null; practiceSet = []; practiceAnswers = []; practiceIndex = 0; practiceAnswer = ''; practiceChecked = false; recallOpen = false;
    examIndex = 0; examReview = false; referenceOpen = false;
    mixedQuestions = null; mixedAnswers = []; mixedChecked = false;
  }
  function resetSessions() { resetTransient(); reviewQueue = []; reviewStarted = false; reviewOpen = false; reviewCount = 0; }
  function persist() {
    progress = { ...progress };
    if (protectStoredData) return;
    try {
      if (localStorage.getItem(STORAGE_KEY) !== storedSnapshot) { synchronize(); notice = 'Ada perubahan dari tab lain. Data terbaru dimuat; silakan ulangi tindakan terakhir.'; return; }
      saveProgress(localStorage, progress); storedSnapshot = localStorage.getItem(STORAGE_KEY); storageError = '';
    } catch { storageError = 'Progres belum tersimpan. Jangan tutup halaman; ekspor cadangan melalui Pengaturan.'; }
  }
  function moduleNumber(module: number) { return moduleOrder.indexOf(module) + 1; }
  function status(lesson: Lesson) {
    if (isPassed(progress, lesson)) return 'Lulus pemahaman';
    if (progress.lessons[lesson.id]?.passed) return 'Perlu cek revisi';
    return progress.lessons[lesson.id] ? 'Sedang dipelajari' : 'Siap dipelajari';
  }
  function showPhase(phase: LearningPhase) {
    if (!activeLesson) return;
    if (phase === 'practice' && lessonStep < 3 && !progress.drafts[activeLesson.id]) beginPractice();
    else if (phase === 'check' && lessonStep < 4 && !exam) return;
    else lessonPhase = phase;
    window.scrollTo({ top: 0, behavior: 'instant' }); focusMain();
  }
  function beginPractice() {
    if (!activeLesson) return;
    lessonStep = 3; lessonPhase = 'practice'; result = null; recallOpen = false;
    progress.lessons[activeLesson.id] = { ...stateFor(progress, activeLesson), step: 3 };
    progress.lastLesson = activeLesson.id;
    startPractice(activeLesson); saveActivity();
  }
  function startPractice(lesson: Lesson) {
    practiceSet = questions(lesson, stateFor(progress,lesson).attempts, 'practice', Math.random, stateFor(progress,lesson).wrong);
    practiceAnswers = Array(practiceSet.length).fill(''); practiceIndex = 0; practiceAnswer = ''; practiceChecked = false;
  }
  function saveActivity(lesson = activeLesson) {
    if (!lesson) return;
    progress.lastLesson = lesson.id;
    progress.lessons[lesson.id] = { ...stateFor(progress,lesson), step: exam ? 5 : 3 };
    progress.drafts[lesson.id] = { lesson: lesson.id, revision: lesson.revision,
      mode: exam ? 'check' : 'practice', questions: exam ?? practiceSet, answers: [...(exam ? examAnswers : practiceAnswers)],
      index: exam ? examIndex : practiceIndex, checked: exam ? false : practiceChecked };
    persist();
  }
  function choosePractice(value: string) { practiceAnswer = value; practiceAnswers[practiceIndex] = value; saveActivity(); }
  function nextPractice() {
    if (practiceIndex === practiceSet.length - 1) { completePractice(); return; }
    practiceIndex += 1; practiceAnswer = practiceAnswers[practiceIndex]; practiceChecked = false; saveActivity(); focusMain();
  }
  function completePractice() {
    if (!activeLesson) return;
    lessonStep = 4; recallOpen = false; delete progress.drafts[activeLesson.id];
    practiceSet = []; practiceAnswers = []; practiceIndex = 0; practiceAnswer = ''; practiceChecked = false;
    progress.lessons[activeLesson.id] = { ...stateFor(progress, activeLesson), step: 4 };
    persist(); focusMain();
  }
  function startExam() {
    if (!activeLesson) return;
    lessonPhase = 'check'; lessonStep = 5; examIndex = 0; examReview = false;
    exam = questions(activeLesson, stateFor(progress,activeLesson).attempts); examAnswers = Array(exam.length).fill(''); result = null; saveActivity(); focusMain();
  }
  function chooseExam(value: string) { examAnswers[examIndex] = value; saveActivity(); }
  function moveExam(next: number) { if (!exam) return; examIndex = Math.max(0, Math.min(exam.length - 1, next)); examReview = false; saveActivity(); focusMain(); }
  function reviewExam() { examReview = true; saveActivity(); focusMain(); }
  function submitExam() {
    if (!activeLesson || !exam || examAnswers.some(answer => !answer)) { notice = 'Jawab kelima pertanyaan sebelum memeriksa hasil.'; return; }
    day = today(); result = finishLesson(progress, activeLesson, exam, examAnswers, day); exam = null; examReview = false; lessonStep = 5; lessonPhase = 'check'; persist(); window.scrollTo({ top: 0, behavior: 'instant' }); focusMain();
  }
  function startRemediation() { result = null; beginPractice(); }
  function restartActivity() {
    if (!activeLesson) return;
    delete progress.drafts[activeLesson.id];
    progress.lessons[activeLesson.id] = { ...stateFor(progress, activeLesson), step: 0 };
    lessonStep = 0; lessonPhase = 'material'; resetTransient(); persist(); focusMain();
  }
  function startReview() {
    day = today(); reviewQueue = dueCards(progress,day).slice(0,10).map(id => ({ id, correction:false })); reviewStarted = true; reviewCount = 0; reviewOpen = false;
  }
  function answerReview(remembered: boolean) {
    day = today();
    const item = reviewQueue.shift(); if (!item) return;
    if (!item.correction && reviewCard(progress, item.id, remembered, day)) {
      reviewCount += 1;
      if (!remembered) reviewQueue.splice(Math.min(3,reviewQueue.length),0,{ id:item.id, correction:true });
      persist();
    }
    reviewOpen = false; reviewQueue = [...reviewQueue]; focusMain();
  }
  function finishCorrection() { reviewQueue.shift(); reviewQueue = [...reviewQueue]; reviewOpen = false; focusMain(); }
  function filterLessons(value: string) {
    const query = normalizeSearch(value); if (!query) return lessons;
    return lessons.filter(lesson => normalizeSearch([lesson.title,lesson.goal,lesson.intro,lesson.source,...lesson.facts.flatMap(f=>[f.term,f.meaning])].join(' ')).includes(query));
  }
  function filterMaterialLessons() {
    const query = normalizeSearch(materialSearch);
    return lessons.filter(lesson => {
      const matchesQuery = !query || normalizeSearch([lesson.title, lesson.goal, lesson.source, ...lesson.facts.flatMap(fact => [fact.term, fact.meaning])].join(' ')).includes(query);
      const state = progress.lessons[lesson.id];
      const matchesStatus = materialStatus === 'all' || materialStatus === 'mastered' && isPassed(progress, lesson) || materialStatus === 'revision' && !!state?.passed && !isPassed(progress, lesson) || materialStatus === 'learning' && !!state && !state.passed || materialStatus === 'new' && !state;
      return matchesQuery && matchesStatus;
    });
  }
  function updateMaterialsQuery() {
    const params = new URLSearchParams();
    if (materialSearch) params.set('q', materialSearch);
    if (materialStatus !== 'all') params.set('status', materialStatus);
    if (openModules.length === 1) params.set('module', openModules[0]);
    history.replaceState(null, '', `#materials${params.size ? `?${params}` : ''}`);
  }
  function setMaterialStatus(value: string) { materialStatus = value as MaterialStatus; updateMaterialsQuery(); }
  function setModuleOpen(module: number, open: boolean) {
    const id = String(module);
    openModules = open ? [id] : openModules.filter(item => item !== id);
    updateMaterialsQuery();
  }
  function changeReferenceTab(value: string) {
    referenceTab = value;
    const lesson = referenceLessonId ? `lesson=${encodeURIComponent(referenceLessonId)}` : '';
    location.hash = value === 'source' ? `reference?${lesson ? `${lesson}&` : ''}tab=source` : lesson ? `reference?${lesson}` : 'reference';
  }
  function materialsHref(lessonId = '') {
    const params = new URLSearchParams();
    if (materialSearch) params.set('q', materialSearch);
    if (materialStatus !== 'all') params.set('status', materialStatus);
    if (activeLesson) params.set('module', String(activeLesson.module));
    if (lessonId) params.set('lesson', lessonId);
    return `#materials${params.size ? `?${params}` : ''}`;
  }
  function lessonHref(lesson: Lesson) {
    const params = new URLSearchParams();
    if (materialSearch) params.set('q', materialSearch);
    if (materialStatus !== 'all') params.set('status', materialStatus);
    params.set('module', String(lesson.module));
    return `#lesson/${lesson.id}?${params}`;
  }
  function startMixed() {
    const learned = lessons.filter(lesson => isPassed(progress,lesson));
    const weak = new Set(learned.flatMap(lesson => progress.lessons[lesson.id]?.wrong ?? []));
    const pool = learned.flatMap(allQuestions).filter(q=>q.purpose === 'check');
    mixedQuestions = [...shuffle(pool.filter(q=>weak.has(q.id))),...shuffle(pool.filter(q=>!weak.has(q.id)))].slice(0,5).map(q=>({...q,options:shuffle(q.options)}));
    mixedAnswers = Array(mixedQuestions.length).fill(''); mixedChecked = false;
  }
  function submitMixed() {
    if (!mixedQuestions || mixedAnswers.some(answer => !answer)) { notice = 'Jawab semua pertanyaan latihan campuran.'; return; }
    mixedQuestions.forEach((question,index) => {
      const state = progress.lessons[question.lesson]; if (!state) return;
      const wrong = new Set(state.wrong); question.answer === mixedAnswers[index] ? wrong.delete(question.id) : wrong.add(question.id); state.wrong = [...wrong];
    }); mixedChecked = true; persist(); focusMain();
  }
  function wrongQuestions(lesson: Lesson) { return allQuestions(lesson).filter(q=>progress.lessons[lesson.id]?.wrong.includes(q.id)); }
  function download(data: string, name: string, type = 'application/json') {
    const url = URL.createObjectURL(new Blob([data],{type})); const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function downloadArchive() {
    try { download(JSON.stringify({exportedAt:new Date().toISOString(),progress:JSON.parse(archivedData)},null,2), 'sharaf-sebelum-migrasi.json'); }
    catch { download(archivedData, 'sharaf-arsip-mentah.json'); }
  }
  function downloadOld() {
    try { download(localStorage.getItem(STORAGE_KEY) ?? 'null', `sharaf-data-lama-${day}.json`); }
    catch { storageError = 'Browser tidak mengizinkan pembacaan data lama. Ekspor cadangan sesi yang masih terbuka.'; }
  }
  async function selectBackup(event: Event) {
    const input = event.currentTarget as HTMLInputElement, file = input.files?.[0]; if (!file) return;
    try {
      if (file.size > 2_000_000) throw Error('Pilih cadangan JSON di bawah 2 MB.');
      pendingBackup = readBackup(await file.text()); importError = '';
    } catch(error) { pendingBackup = null; importError = error instanceof Error ? error.message : 'Cadangan tidak dapat dibaca.'; }
    input.value = '';
  }
  function restoreBackup() {
    if (!pendingBackup) return;
    try {
      const old = localStorage.getItem(STORAGE_KEY); if (old) localStorage.setItem('sharaf.progress.before-restore',old);
      saveProgress(localStorage,pendingBackup); progress = pendingBackup; pendingBackup = null; storedSnapshot = localStorage.getItem(STORAGE_KEY);
      protectStoredData = false; storageError = ''; importError = ''; resetSessions(); readRoute(); notice = 'Cadangan berhasil dipulihkan. Sesi sebelumnya ditutup; draft revisi lama tidak dilanjutkan.';
    } catch { importError = 'Browser gagal menyimpan cadangan. Progres lama tidak diubah.'; }
  }
  function setArabicSize(event: Event) { progress.arabicSize = Number((event.currentTarget as HTMLInputElement).value); persist(); }
</script>
<svelte:head>
  <title>Sharaf — ruang belajar pribadi</title>
  <meta name="description" content="Belajar sharaf secara bertahap dengan latihan dan pengulangan." />
</svelte:head>

<div style:--arabic-size={`${progress.arabicSize / 16}rem`}>
  <AppShell {route} due={due.length} {pageTitle} onskip={focusMain}>
    {#if storageError}
      <Alert.Root variant="destructive" class="mb-6"><CircleAlert class="size-4" /><Alert.Title>Progres belum aman</Alert.Title><Alert.Description>{storageError} <a class="font-medium underline" href="#settings">Buka pengaturan</a></Alert.Description></Alert.Root>
    {/if}
    {#if notice}
      <Alert.Root class="mb-6"><CheckCircle class="size-4" /><Alert.Title>Pembaruan</Alert.Title><Alert.Description>{notice}</Alert.Description></Alert.Root>
    {/if}

    {#if route === 'today'}
      {@const target = resumeTarget}
      {@const targetIndex = target ? lessons.indexOf(target) : -1}
      <PageHeader title="Hari ini" description="Lanjutkan dari tempat terakhir, lalu sisihkan beberapa menit untuk mengingat kembali.">
        {#snippet aside()}<time class="text-sm capitalize text-muted-foreground">{new Date(`${day}T12:00:00`).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</time>{/snippet}
      </PageHeader>

      <div class="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,.75fr)]">
        <Card.Root class="overflow-hidden border-primary/20 shadow-none">
          <Card.Header class="gap-4 border-b bg-accent/50 sm:flex-row sm:items-start sm:justify-between">
            <div><Badge class="mb-3">Aktivitas utama</Badge><Card.Title class="text-xl sm:text-2xl"><Text text={target?.title ?? 'Semua pelajaran sudah dikuasai'} scale="ui" /></Card.Title><Card.Description class="mt-2 max-w-2xl leading-6"><Text text={target?.goal ?? 'Pertahankan pemahaman melalui pengulangan dan latihan campuran.'} /></Card.Description></div>
            {#if target}<div class="rounded-lg border bg-card px-3 py-2 text-xs text-muted-foreground">Bagian {moduleNumber(target.module)}<span class="mx-1">·</span>{progress.drafts[target.id]?.mode === 'check' ? 'Cek' : progress.drafts[target.id]?.mode === 'practice' ? 'Latihan' : 'Materi'}</div>{/if}
          </Card.Header>
          <Card.Content class="grid gap-6 pt-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>{#if target}<p class="text-sm leading-6 text-muted-foreground">{modules[target.module][0]} · sesi sekitar 10–15 menit</p><div class="mt-4 flex items-center gap-3"><span class="arabic-text text-4xl" lang="ar" dir="rtl"><Text text={target.facts[0].term} /></span><span class="text-sm text-muted-foreground"><Text text={target.facts[0].meaning} /></span></div>{:else}<p class="text-sm text-muted-foreground">Pengulangan dan latihan campuran tetap tersedia.</p>{/if}</div>
            <Button href={target ? `#lesson/${target.id}` : '#mixed'} size="lg" class="h-11 sm:min-w-44">{target ? progress.lessons[target.id] ? 'Lanjutkan belajar' : 'Mulai belajar' : 'Latihan campuran'}<ArrowRight class="size-4" /></Button>
          </Card.Content>
        </Card.Root>

        <Card.Root class="shadow-none">
          <Card.Header><Card.Title class="flex items-center gap-2 text-base"><Brain class="size-5 text-primary" />Pengulangan hari ini</Card.Title><Card.Description>{due.length ? `${due.length} kartu siap diulang.` : 'Belum ada kartu jatuh tempo.'}</Card.Description></Card.Header>
          <Card.Content><Button href="#review" variant={due.length ? 'default' : 'outline'} class="h-11 w-full">{due.length ? 'Mulai pengulangan' : 'Lihat jadwal'}<ArrowRight class="size-4" /></Button></Card.Content>
        </Card.Root>
      </div>

      <div class="mt-6 grid gap-5 lg:grid-cols-2">
        <Card.Root class="shadow-none"><Card.Header><Card.Title class="text-base">Kemajuan</Card.Title><Card.Description>{passedCount} dari {lessons.length} pelajaran dikuasai</Card.Description></Card.Header><Card.Content><UiProgress value={passedCount} max={lessons.length} label="Kemajuan pelajaran" /><div class="mt-3 flex justify-between text-xs text-muted-foreground"><span>{Math.round(passedCount / lessons.length * 100)}%</span><a href="#progress" class="font-medium text-primary hover:underline">Lihat progres</a></div></Card.Content></Card.Root>
        <Card.Root class="shadow-none"><Card.Header><Card.Title class="text-base">Berikutnya dalam jalur Anda</Card.Title><Card.Description>Pilih rekomendasi atau buka peta materi.</Card.Description></Card.Header><Card.Content class="divide-y p-0">{#each lessons.slice(Math.max(0, targetIndex), Math.max(0, targetIndex) + 3) as lesson}<a href={`#lesson/${lesson.id}`} class="flex min-h-16 items-center gap-3 px-6 py-3 hover:bg-muted/60"><span class="grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-xs font-semibold">{lessons.indexOf(lesson) + 1}</span><span class="min-w-0 flex-1"><strong class="block truncate text-sm"><Text text={lesson.title} scale="ui" /></strong><small class="block truncate text-xs text-muted-foreground">{modules[lesson.module][0]}</small></span><ArrowRight class="size-4 text-muted-foreground" /></a>{/each}</Card.Content><Card.Footer class="border-t"><Button href="#materials" variant="ghost" class="h-11 w-full">Buka seluruh materi</Button></Card.Footer></Card.Root>
      </div>

    {:else if route === 'materials'}
      <PageHeader title="Peta materi" description="Sembilan bagian belajar yang dapat dibuka dalam urutan rekomendasi atau sesuai kebutuhan Anda." />
      <div class="mb-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_14rem]">
        <label class="relative block"><span class="sr-only">Cari materi</span><Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input bind:value={materialSearch} oninput={updateMaterialsQuery} class="h-11 pl-9" placeholder="Cari judul, istilah, atau bentuk Arab" /></label>
        <label><span class="sr-only">Filter status materi</span><select value={materialStatus} onchange={(event) => setMaterialStatus(event.currentTarget.value)} class="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:ring-3 focus-visible:ring-ring/25"><option value="all">Semua status</option><option value="new">Belum dipelajari</option><option value="learning">Sedang dipelajari</option><option value="mastered">Dikuasai</option><option value="revision">Perlu cek ulang</option></select></label>
      </div>
      {#if !materialLessons.length}<Card.Root class="border-dashed shadow-none"><Card.Content class="py-12 text-center"><BookOpen class="mx-auto mb-3 size-8 text-muted-foreground" /><h2 class="font-semibold">Materi tidak ditemukan</h2><p class="mt-2 text-sm text-muted-foreground">Ubah kata pencarian atau filter status.</p></Card.Content></Card.Root>{/if}
      <div class="space-y-3">
        {#each moduleOrder as moduleIndex}
          {@const moduleLessons = materialLessons.filter(lesson => lesson.module === moduleIndex)}
          {#if moduleLessons.length}
            <details class="group rounded-xl border bg-card px-4 sm:px-6" open={openModules.includes(String(moduleIndex))} ontoggle={(event) => setModuleOpen(moduleIndex, event.currentTarget.open)}>
              <summary class="flex min-h-18 cursor-pointer list-none items-center gap-4 py-4 marker:hidden"><span class="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-sm font-semibold">{moduleNumber(moduleIndex)}</span><span class="min-w-0 flex-1"><strong class="block text-base">{modules[moduleIndex][0]}</strong><small class="mt-1 block text-xs font-normal leading-5 text-muted-foreground">{modules[moduleIndex][1]}</small></span><Badge variant="outline" class="hidden sm:inline-flex">{moduleLessons.filter(lesson => isPassed(progress, lesson)).length}/{moduleLessons.length}</Badge><span aria-hidden="true" class="size-2.5 rotate-45 border-b border-r border-muted-foreground transition-transform group-open:-rotate-135"></span></summary>
              <ol class="divide-y border-t pb-3">{#each moduleLessons as lesson}<li id={`lesson-row-${lesson.id}`} class="grid gap-3 py-4 sm:grid-cols-[2rem_minmax(0,1fr)_auto] sm:items-center"><span class="grid size-8 place-items-center rounded-lg bg-muted text-xs font-medium">{isPassed(progress, lesson) ? '✓' : lessons.indexOf(lesson) + 1}</span><div class="min-w-0"><a href={lessonHref(lesson)} class="font-medium hover:text-primary hover:underline"><Text text={lesson.title} scale="ui" /></a><p class="mt-1 text-xs leading-5 text-muted-foreground">{lesson.goal}</p><div class="mt-2 sm:hidden"><Badge variant="outline">{status(lesson)}</Badge></div></div><div class="hidden items-center gap-2 sm:flex"><Badge variant="outline">{status(lesson)}</Badge><Button href={`#reference?lesson=${lesson.id}`} variant="ghost" size="sm">Referensi</Button></div></li>{/each}</ol>
            </details>
          {/if}
        {/each}
      </div>

    {:else if route === 'lesson'}
      {#if !activeLesson}
        <Card.Root class="mx-auto max-w-xl border-dashed text-center shadow-none"><Card.Content class="py-14"><h1 class="text-xl font-semibold">Pelajaran tidak ditemukan</h1><Button href="#materials" class="mt-5 h-11">Kembali ke materi</Button></Card.Content></Card.Root>
      {:else}
        <nav aria-label="Breadcrumb" class="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><a href={materialsHref(activeLesson.id)} class="hover:text-foreground hover:underline">Materi</a><span>/</span><span>Bagian {moduleNumber(activeLesson.module)}</span><span>/</span><span class="text-foreground"><Text text={activeLesson.title} scale="ui" /></span></nav>
        <header class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div class="max-w-3xl"><p class="mb-2 text-sm font-medium text-primary">{modules[activeLesson.module][0]}</p><h1 class="text-2xl font-semibold tracking-tight sm:text-3xl"><Text text={activeLesson.title} scale="ui" /></h1><p class="mt-2 text-sm leading-6 text-muted-foreground">{activeLesson.source} · sesi sekitar 10–15 menit</p></div><div class="flex flex-wrap gap-2"><Button variant="outline" class="h-11" onclick={() => referenceOpen = true}><BookOpen class="size-4" />Referensi</Button>{#if progress.drafts[activeLesson.id]}<AlertDialog.Root><AlertDialog.Trigger>{#snippet child({ props })}<Button variant="ghost" class="h-11" {...props}><RotateCcw class="size-4" />Mulai ulang</Button>{/snippet}</AlertDialog.Trigger><AlertDialog.Content><AlertDialog.Header><AlertDialog.Title>Mulai ulang pelajaran?</AlertDialog.Title><AlertDialog.Description>Jawaban dan posisi pada aktivitas saat ini akan dihapus. Riwayat kelulusan dan kartu pengulangan tidak berubah.</AlertDialog.Description></AlertDialog.Header><AlertDialog.Footer><AlertDialog.Cancel class="h-11">Batalkan</AlertDialog.Cancel><AlertDialog.Action class="h-11" onclick={restartActivity}>Mulai ulang</AlertDialog.Action></AlertDialog.Footer></AlertDialog.Content></AlertDialog.Root>{/if}</div></header>
        {#if activeLesson.prerequisite && !isPassed(progress, lessons.find(lesson => lesson.id === activeLesson?.prerequisite)!)}<Alert.Root class="mb-5"><CircleAlert class="size-4" /><Alert.Title>Bekal yang disarankan</Alert.Title><Alert.Description>Pelajari <a class="font-medium text-primary hover:underline" href={`#lesson/${activeLesson.prerequisite}`}>{lessons.find(lesson => lesson.id === activeLesson?.prerequisite)?.title}</a> terlebih dahulu, atau tetap lanjutkan pelajaran ini.</Alert.Description></Alert.Root>{/if}
        <div class="mx-auto max-w-3xl"><PhaseNav phase={lessonPhase} practiceReady={lessonStep >= 3 || !!progress.drafts[activeLesson.id]} checkReady={lessonStep >= 4 || !!exam || !!result} onphase={showPhase} />

          {#if lessonPhase === 'material'}
            <Card.Root class="shadow-none"><Card.Content class="space-y-10 px-5 py-6 sm:px-8 sm:py-8">
              <section id="pahami"><p class="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Pahami</p><h2 class="text-xl font-semibold leading-8"><Text text={activeLesson.goal} /></h2><p class="mt-4 max-w-[68ch] text-base leading-8 text-muted-foreground"><Text text={activeLesson.intro} /></p><div class="mt-5 rounded-xl bg-muted/70 p-5"><h3 class="text-sm font-semibold">Cara membayangkannya</h3><p class="mt-2 text-sm leading-7 text-muted-foreground"><Text text={activeLesson.analogy} /></p></div></section>
              <section id="contoh"><p class="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Contoh</p><h2 class="text-xl font-semibold">Bentuk dan makna</h2><div class="mt-4 divide-y rounded-xl border px-4 sm:px-5">{#each activeLesson.facts as fact}<div class="grid gap-2 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6"><bdi class="font-arabic text-[length:var(--arabic-size)] leading-loose" lang="ar" dir="rtl">{fact.term}</bdi><div><strong class="text-sm font-medium sm:text-base"><Text text={fact.meaning} /></strong><p class="mt-1 text-sm leading-6 text-muted-foreground"><Text text={fact.why} /></p></div></div>{/each}</div></section>
              <section id="bandingkan"><p class="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Bandingkan</p><h2 class="text-xl font-semibold">Jangan sampai tertukar</h2><p class="mt-4 text-base leading-8 text-muted-foreground"><Text text={activeLesson.contrast} /></p><ul class="mt-5 space-y-3">{#each activeLesson.summary as item}<li class="flex gap-3 text-sm leading-6"><Check class="mt-1 size-4 shrink-0 text-primary" /><span><Text text={item} /></span></li>{/each}</ul></section>
            </Card.Content><Card.Footer class="justify-end border-t px-5 py-4 sm:px-8"><Button class="h-11" onclick={beginPractice}>Mulai latihan<ArrowRight class="size-4" /></Button></Card.Footer></Card.Root>

          {:else if lessonPhase === 'practice'}
            {#if lessonStep >= 4 && !practiceSet.length}
              <Card.Root class="shadow-none"><Card.Header><Badge variant="secondary" class="w-fit">Ingat kembali</Badge><Card.Title class="text-xl">Jelaskan dengan kata Anda sendiri</Card.Title><Card.Description class="leading-6">{activeLesson.goal} Tutup referensi, ucapkan contohnya, lalu bandingkan.</Card.Description></Card.Header><Card.Content>{#if recallOpen}<div class="rounded-xl bg-muted p-5"><h3 class="text-sm font-semibold">Poin jawaban</h3><ul class="mt-3 space-y-3">{#each activeLesson.summary as item}<li class="flex gap-3 text-sm leading-6"><Check class="mt-1 size-4 shrink-0 text-primary" /><Text text={item} /></li>{/each}</ul></div>{:else}<div class="grid min-h-36 place-items-center rounded-xl border border-dashed px-5 text-center text-sm text-muted-foreground">Pikirkan atau ucapkan jawaban sebelum membuka ringkasan.</div>{/if}</Card.Content><Card.Footer class="flex-col gap-3 border-t sm:flex-row sm:justify-between">{#if recallOpen}<Button variant="outline" class="h-11" onclick={() => recallOpen = false}>Tutup ringkasan</Button><Button class="h-11" onclick={() => exam ? showPhase('check') : startExam()}>{exam ? 'Kembali ke cek' : 'Mulai cek pemahaman'}<ArrowRight class="size-4" /></Button>{:else}<Button class="h-11 w-full sm:w-auto" onclick={() => recallOpen = true}>Buka poin jawaban</Button>{/if}</Card.Footer></Card.Root>
            {:else if practiceSet.length}
              {@const practice = practiceSet[practiceIndex]}
              <Card.Root class="shadow-none"><Card.Header><div class="flex items-center justify-between gap-4"><Badge variant="secondary">Latihan {practiceIndex + 1} dari {practiceSet.length}</Badge><span class="text-xs text-muted-foreground">Tidak menentukan kelulusan</span></div><UiProgress value={practiceIndex + 1} max={practiceSet.length} label="Kemajuan latihan" class="mt-3 h-1.5" /></Card.Header><Card.Content><QuestionView question={practice} answer={practiceAnswer} disabled={practiceChecked} onanswer={choosePractice} />{#if practiceChecked}<Alert.Root variant={practiceAnswer === practice.answer ? 'default' : 'destructive'} class="mt-5"><Alert.Title>{practiceAnswer === practice.answer ? 'Tepat' : 'Belum tepat'}</Alert.Title><Alert.Description><Text text={practice.why} /> <span class="block pt-2">Jawaban: <Text text={practice.answer} /></span></Alert.Description></Alert.Root>{/if}</Card.Content><Card.Footer class="justify-end border-t">{#if practiceChecked}<Button class="h-11" onclick={nextPractice}>{practiceIndex === practiceSet.length - 1 ? 'Selesai latihan' : 'Soal berikutnya'}<ArrowRight class="size-4" /></Button>{:else}<Button class="h-11" disabled={!practiceAnswer} onclick={() => { practiceChecked = true; saveActivity(); }}>Periksa jawaban</Button>{/if}</Card.Footer></Card.Root>
            {/if}

          {:else}
            {#if result}
              <Card.Root class="shadow-none"><Card.Header class={result.passed ? 'bg-accent/50' : 'bg-destructive/5'}><div class="flex items-start gap-4"><span class={result.passed ? 'grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground' : 'grid size-12 place-items-center rounded-xl bg-destructive text-destructive-foreground'}>{result.passed ? '✓' : result.score}</span><div><Card.Title>{result.passed ? 'Pelajaran dikuasai' : 'Perlu latihan perbaikan'}</Card.Title><Card.Description class="mt-1">Skor {result.score}/5. {result.passed ? 'Kartu pengulangan dijadwalkan mulai besok.' : 'Pelajari kesalahan berikut sebelum mencoba lagi.'}</Card.Description></div></div></Card.Header>{#if result.wrong.length}<Card.Content class="space-y-4 pt-6"><h3 class="text-sm font-semibold">Bagian yang perlu diperkuat</h3>{#each allQuestions(activeLesson).filter(question => result?.wrong.includes(question.id)) as question}<div class="rounded-xl border p-4"><strong class="text-sm"><Text text={question.prompt} /></strong><p class="mt-2 text-sm text-muted-foreground">Jawaban: <Text text={question.answer} /></p><p class="mt-2 text-sm leading-6 text-muted-foreground"><Text text={question.why} /></p></div>{/each}</Card.Content>{/if}<Card.Footer class="flex-col gap-3 border-t sm:flex-row sm:justify-end">{#if result.passed}<Button href={nextLesson(progress) ? `#lesson/${nextLesson(progress)?.id}` : '#review'} class="h-11">{nextLesson(progress) ? 'Lanjut ke rekomendasi' : 'Buka pengulangan'}<ArrowRight class="size-4" /></Button>{:else}<Button class="h-11" onclick={startRemediation}>Latihan perbaikan</Button>{/if}<Button href={materialsHref(activeLesson.id)} variant="outline" class="h-11">Kembali ke peta</Button></Card.Footer></Card.Root>
            {:else if exam}
              {#if examReview}
                <Card.Root class="shadow-none"><Card.Header><Badge variant="secondary" class="w-fit">Ringkasan cek</Badge><Card.Title>Periksa jawaban Anda</Card.Title><Card.Description>{examAnswered} dari {exam.length} soal sudah dijawab. Jawaban baru dinilai setelah dikirim.</Card.Description></Card.Header><Card.Content><ol class="divide-y rounded-xl border px-4">{#each exam as question, index}<li><button type="button" onclick={() => { examIndex = index; examReview = false; saveActivity(); }} class="flex min-h-14 w-full items-center gap-3 py-3 text-left"><span class={examAnswers[index] ? 'grid size-7 place-items-center rounded-full bg-primary text-xs text-primary-foreground' : 'grid size-7 place-items-center rounded-full border text-xs text-muted-foreground'}>{examAnswers[index] ? '✓' : index + 1}</span><span class="min-w-0 flex-1 truncate text-sm"><Text text={question.prompt} /></span><span class="text-xs text-muted-foreground">Ubah</span></button></li>{/each}</ol></Card.Content><Card.Footer class="flex-col gap-3 border-t sm:flex-row sm:justify-between"><Button variant="outline" class="h-11" onclick={() => { examReview = false; examIndex = Math.max(0, examAnswers.findIndex(answer => !answer)); }}>Kembali ke soal</Button><Button class="h-11" disabled={examAnswers.some(answer => !answer)} onclick={submitExam}>Kirim jawaban</Button></Card.Footer></Card.Root>
              {:else}
                {@const currentQuestion = exam[examIndex]}
                <Card.Root class="shadow-none"><Card.Header><div class="flex items-center justify-between"><Badge variant="secondary">Soal {examIndex + 1} dari {exam.length}</Badge><span class="text-xs text-muted-foreground">{examAnswered}/{exam.length} terjawab</span></div><UiProgress value={examIndex + 1} max={exam.length} label="Kemajuan cek" class="mt-3 h-1.5" /></Card.Header><Card.Content><QuestionView question={currentQuestion} answer={examAnswers[examIndex]} onanswer={chooseExam} /></Card.Content><Card.Footer class="flex justify-between gap-3 border-t"><Button variant="outline" class="h-11" disabled={examIndex === 0} onclick={() => moveExam(examIndex - 1)}>Sebelumnya</Button>{#if examIndex === exam.length - 1}<Button class="h-11" onclick={reviewExam}>Tinjau jawaban</Button>{:else}<Button class="h-11" onclick={() => moveExam(examIndex + 1)}>Berikutnya<ArrowRight class="size-4" /></Button>{/if}</Card.Footer></Card.Root>
              {/if}
            {:else}
              <Card.Root class="shadow-none"><Card.Header><Badge variant="secondary" class="w-fit">Cek pemahaman</Badge><Card.Title class="text-xl">Lima soal tanpa petunjuk</Card.Title><Card.Description class="leading-6">Jawaban disimpan setiap kali Anda memilih. Anda dapat meninjau semuanya sebelum mengirim.</Card.Description></Card.Header><Card.Content><ul class="space-y-3 text-sm text-muted-foreground"><li class="flex gap-3"><Check class="size-4 shrink-0 text-primary" />Minimal empat jawaban benar.</li><li class="flex gap-3"><Check class="size-4 shrink-0 text-primary" />Semua konsep wajib harus benar.</li><li class="flex gap-3"><Check class="size-4 shrink-0 text-primary" />Kelulusan dan kartu diperbarui setelah submit.</li></ul></Card.Content><Card.Footer class="justify-end border-t"><Button class="h-11" onclick={startExam}>Mulai cek<ArrowRight class="size-4" /></Button></Card.Footer></Card.Root>
            {/if}
          {/if}
        </div>
        <LessonReferenceSheet lesson={activeLesson} bind:open={referenceOpen} />
      {/if}

    {:else if route === 'review' || route === 'mixed'}
      <PageHeader title="Latihan" description="Ingat kembali materi pada waktunya atau hubungkan pelajaran yang sudah dikuasai." />
      <nav aria-label="Jenis latihan" class="mb-6 inline-flex w-full items-center rounded-lg bg-muted p-1 sm:w-auto"><a href="#review" aria-current={route === 'review' ? 'page' : undefined} class={route === 'review' ? 'flex min-h-11 flex-1 items-center justify-center rounded-md bg-background px-4 text-sm font-medium shadow-sm sm:min-w-32' : 'flex min-h-11 flex-1 items-center justify-center rounded-md px-4 text-sm font-medium text-muted-foreground sm:min-w-32'}>Ulangi {#if due.length}<Badge variant="secondary" class="ml-2">{due.length}</Badge>{/if}</a><a href="#mixed" aria-current={route === 'mixed' ? 'page' : undefined} class={route === 'mixed' ? 'flex min-h-11 flex-1 items-center justify-center rounded-md bg-background px-4 text-sm font-medium shadow-sm sm:min-w-32' : 'flex min-h-11 flex-1 items-center justify-center rounded-md px-4 text-sm font-medium text-muted-foreground sm:min-w-32'}>Campuran</a></nav>
      {#if route === 'review'}
          {#if !reviewQueue.length}
            <Card.Root class="mx-auto max-w-2xl text-center shadow-none"><Card.Content class="py-12"><Brain class="mx-auto mb-4 size-9 text-primary" /><h2 class="text-xl font-semibold">{reviewStarted ? 'Sesi pengulangan selesai' : due.length ? `${due.length} kartu siap diulang` : 'Belum ada kartu jatuh tempo'}</h2><p class="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">{reviewStarted ? `${reviewCount} kartu terjadwal diperiksa. Latihan koreksi tidak menambah retensi.` : eligibleCards.length ? 'Kartu akan muncul kembali sesuai jadwalnya.' : 'Lulus satu pelajaran untuk menjadwalkan kartu mulai esok hari.'}</p><div class="mt-6 flex flex-wrap justify-center gap-3">{#if due.length}<Button class="h-11" onclick={startReview}>{reviewStarted ? 'Lanjutkan kartu berikutnya' : 'Mulai pengulangan'}</Button>{:else}<Button href={nextLesson(progress) ? `#lesson/${nextLesson(progress)?.id}` : '#materials'} class="h-11">{nextLesson(progress) ? 'Lanjut belajar' : 'Lihat materi'}</Button>{/if}{#if eligibleCards.length}<Button href="#mixed" variant="outline" class="h-11">Latihan campuran</Button>{/if}</div></Card.Content></Card.Root>
            <div class="mx-auto mt-6 flex max-w-lg items-center justify-between rounded-xl border bg-card px-5 py-4 text-center"><span><strong class="block text-lg">1</strong><small class="text-xs text-muted-foreground">hari</small></span><span class="text-border">—</span><span><strong class="block text-lg">3</strong><small class="text-xs text-muted-foreground">hari</small></span><span class="text-border">—</span><span><strong class="block text-lg">7</strong><small class="text-xs text-muted-foreground">hari</small></span><span class="text-border">—</span><span><strong class="block text-lg">14</strong><small class="text-xs text-muted-foreground">hari</small></span><span class="text-border">—</span><span><strong class="block text-lg">30</strong><small class="text-xs text-muted-foreground">hari</small></span></div>
          {:else if currentReview && currentCard}
            <Card.Root class="mx-auto max-w-2xl text-center shadow-none"><Card.Header><Badge variant="secondary" class="mx-auto">{currentReview.correction ? 'Latihan koreksi' : `Kartu ${reviewCount + 1}`}</Badge><Card.Description>{currentCard.lesson.title}</Card.Description></Card.Header><Card.Content><p class="text-base text-muted-foreground">Sebutkan bentuk untuk:</p><p class="mt-3 text-lg font-medium"><Text text={currentCard.fact.meaning} /></p>{#if reviewOpen}<div class="mt-7 border-t pt-7"><bdi class="font-arabic block text-[length:calc(var(--arabic-size)*1.35)] leading-loose" lang="ar" dir="rtl">{currentCard.fact.term}</bdi><p class="mt-3 text-sm leading-6 text-muted-foreground"><Text text={currentCard.fact.why} /></p></div>{:else}<div class="mt-7 grid min-h-36 place-items-center rounded-xl border border-dashed text-sm text-muted-foreground">Pikirkan atau ucapkan jawabannya.</div>{/if}</Card.Content><Card.Footer class="justify-center gap-3 border-t">{#if reviewOpen}{#if currentReview.correction}<Button class="h-11" onclick={finishCorrection}>Sudah saya ulangi</Button>{:else}<Button variant="outline" class="h-11" onclick={() => answerReview(false)}>Belum ingat</Button><Button class="h-11" onclick={() => answerReview(true)}>Ingat</Button>{/if}{:else}<Button class="h-11" onclick={() => reviewOpen = true}>Buka jawaban</Button>{/if}</Card.Footer></Card.Root>
          {/if}
      {:else}
          {#if !passedCount}<Card.Root class="mx-auto max-w-2xl text-center shadow-none"><Card.Content class="py-12"><h2 class="text-xl font-semibold">Mulai dengan satu pelajaran</h2><Button href="#materials" class="mt-6 h-11">Buka materi</Button></Card.Content></Card.Root>{:else if !mixedQuestions}<Card.Root class="mx-auto max-w-2xl text-center shadow-none"><Card.Content class="py-12"><h2 class="text-xl font-semibold">Hubungkan yang sudah dipahami</h2><p class="mt-3 text-sm text-muted-foreground">Lima soal dari materi yang sudah dikuasai. Kesalahan terakhir mendapat prioritas.</p><Button class="mt-6 h-11" onclick={startMixed}>Mulai lima soal</Button></Card.Content></Card.Root>{:else}<Card.Root class="mx-auto max-w-3xl shadow-none">{#if mixedChecked}<Card.Header><Card.Title>{mixedQuestions.filter((question, index) => question.answer === mixedAnswers[index]).length} dari 5 benar</Card.Title><Card.Description>Pelajari kembali jawaban yang belum tepat.</Card.Description></Card.Header><Card.Content class="space-y-4">{#each mixedQuestions as question, index}<Alert.Root variant={question.answer === mixedAnswers[index] ? 'default' : 'destructive'}><Alert.Title><Text text={question.prompt} /></Alert.Title><Alert.Description>Jawaban Anda: <Text text={mixedAnswers[index]} />. Jawaban benar: <Text text={question.answer} />. <Text text={question.why} /></Alert.Description></Alert.Root>{/each}</Card.Content><Card.Footer class="justify-end border-t"><Button class="h-11" onclick={startMixed}>Latihan baru</Button></Card.Footer>{:else}<Card.Header><Card.Title>Latihan campuran</Card.Title><Card.Description>Jawab semua soal, lalu periksa hasilnya sekaligus.</Card.Description></Card.Header><Card.Content class="space-y-8">{#each mixedQuestions as question, index}<QuestionView {question} answer={mixedAnswers[index]} onanswer={(value) => mixedAnswers[index] = value} />{/each}</Card.Content><Card.Footer class="justify-end border-t"><Button class="h-11" disabled={mixedAnswers.some(answer => !answer)} onclick={submitMixed}>Periksa jawaban</Button></Card.Footer>{/if}</Card.Root>{/if}
      {/if}

    {:else if route === 'progress'}
      {@const retained = eligibleCards.map(([, card]) => card).filter(card => card.successes.length >= 3 && !card.weak).length}
      {@const weakLessons = lessons.filter(lesson => progress.lessons[lesson.id]?.wrong.length || isPassed(progress, lesson) && lesson.facts.some((_, index) => progress.cards[cardId(lesson, index)]?.weak))}
      <PageHeader title="Progres" description="Pemahaman terbaru, riwayat belajar, dan daya ingat berkembang dengan cara yang berbeda." />
      <div class="grid gap-5 md:grid-cols-2"><Card.Root class="shadow-none"><Card.Header><Card.Title class="text-base">Penguasaan terbaru</Card.Title><Card.Description>Lulus cek pada revisi materi saat ini.</Card.Description></Card.Header><Card.Content><p class="text-3xl font-semibold tabular-nums">{passedCount}<span class="text-base font-normal text-muted-foreground"> / {lessons.length}</span></p><UiProgress value={passedCount} max={lessons.length} label="Penguasaan terbaru" class="mt-4" /><p class="mt-3 text-xs text-muted-foreground">{Object.values(progress.lessons).filter(state => state.passed).length} pelajaran pernah lulus.</p></Card.Content></Card.Root><Card.Root class="shadow-none"><Card.Header><Card.Title class="text-base">Retensi mulai terbentuk</Card.Title><Card.Description>Ingat pada tiga tanggal berbeda.</Card.Description></Card.Header><Card.Content><p class="text-3xl font-semibold tabular-nums">{retained}<span class="text-base font-normal text-muted-foreground"> / {eligibleCards.length}</span></p><UiProgress value={retained} max={eligibleCards.length || 1} label="Retensi kartu" class="mt-4" /><Button href="#review" variant="link" class="mt-2 px-0">Buka pengulangan</Button></Card.Content></Card.Root></div>
      <section class="mt-8"><div class="mb-4 flex items-center justify-between"><div><h2 class="text-lg font-semibold">Perlu diperkuat</h2><p class="mt-1 text-sm text-muted-foreground">Kesalahan cek dan kartu yang belum diingat.</p></div>{#if passedCount}<Button href="#mixed" variant="outline" class="h-11">Latihan campuran</Button>{/if}</div>{#if weakLessons.length}<div class="divide-y rounded-xl border bg-card px-5">{#each weakLessons as lesson}<div class="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"><div><h3 class="font-medium"><Text text={lesson.title} scale="ui" /></h3>{#each wrongQuestions(lesson).slice(0, 2) as question}<p class="mt-1 text-xs leading-5 text-muted-foreground"><Text text={question.prompt} /></p>{/each}</div><Button href={`#lesson/${lesson.id}`} variant="outline" class="h-11 shrink-0">Pelajari ulang</Button></div>{/each}</div>{:else}<div class="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">Belum ada kesalahan yang perlu diperbaiki.</div>{/if}</section>
      <section class="mt-8"><h2 class="text-lg font-semibold">Jadwal berikutnya</h2>{#if eligibleCards.length}<div class="mt-4 overflow-hidden rounded-xl border bg-card"><div class="divide-y">{#each eligibleCards.slice().sort((a, b) => a[1].due.localeCompare(b[1].due)).slice(0, 10) as [id, card]}{@const data = getCard(id)}{#if data}<div class="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_8rem_8rem] sm:items-center"><span class="font-arabic text-2xl" lang="ar" dir="rtl">{data.fact.term}</span><span class="text-sm">{card.due <= day ? 'Jatuh tempo' : new Date(`${card.due}T12:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span><small class="text-xs text-muted-foreground">{card.successes.length}/3 berhasil</small></div>{/if}{/each}</div></div>{:else}<div class="mt-4 rounded-xl border border-dashed p-6 text-sm text-muted-foreground">Kartu pertama dijadwalkan setelah satu pelajaran lulus.</div>{/if}</section>

    {:else if route === 'reference'}
      <PageHeader title="Referensi" description="Cari penjelasan terkurasi atau baca transkripsi sumber asli tanpa mengubah progres." />
      <div class="mb-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"><label class="relative"><span class="sr-only">Cari referensi</span><Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input bind:value={search} class="h-11 pl-9" placeholder="Cari dhamir, ماضي, atau enam bab" /></label>{#if referenceReturnId}<Button href={`#lesson/${referenceReturnId}`} variant="outline" class="h-11">Kembali ke aktivitas</Button>{/if}</div>
      <details class="mb-6 rounded-xl border bg-card px-5"><summary class="flex min-h-12 cursor-pointer items-center text-sm font-medium">Tentang sumber dan verifikasi</summary><div class="border-t pb-5 pt-4"><p class="max-w-[70ch] text-sm leading-7 text-muted-foreground">Materi baru dicocokkan dengan transkripsi. Lima pelajaran awal memiliki catatan verifikasi scan terdahulu. Mazid hanya pengantar dan materi meragukan tidak menjadi kunci cek.</p><Button variant="link" class="mt-2 h-11 px-0" onclick={() => download(source, 'Sharaf-Lengkap.md', 'text/markdown')}>Unduh transkripsi Markdown</Button></div></details>
      <Tabs.Root bind:value={referenceTab} onValueChange={changeReferenceTab}><Tabs.List class="mb-6 h-11 w-full sm:w-auto" variant="line"><Tabs.Trigger value="lesson">Penjelasan pelajaran</Tabs.Trigger><Tabs.Trigger value="source">Sumber asli</Tabs.Trigger></Tabs.List><Tabs.Content value="lesson">{#if requested}<Card.Root class="mb-6 shadow-none"><Card.Header><Card.Title><Text text={requested.title} scale="ui" /></Card.Title><Card.Description class="leading-6"><Text text={requested.intro} /></Card.Description></Card.Header><Card.Content><div class="divide-y rounded-xl border px-4">{#each requested.facts as fact}<div class="grid gap-2 py-4 sm:grid-cols-[9rem_1fr] sm:gap-5"><bdi class="font-arabic text-[length:var(--arabic-size)] leading-loose" lang="ar" dir="rtl">{fact.term}</bdi><div><strong class="text-sm"><Text text={fact.meaning} /></strong><p class="mt-1 text-xs leading-5 text-muted-foreground"><Text text={fact.why} /></p></div></div>{/each}</div><SourceReferences lesson={requested} /></Card.Content></Card.Root>{/if}<Accordion.Root type="single" class="rounded-xl border bg-card px-5"><Accordion.Item value="lessons" class="border-0"><Accordion.Trigger class="min-h-14 hover:no-underline"><span class="flex-1 text-left">Pelajaran terkurasi <span class="ml-2 text-xs font-normal text-muted-foreground">{referenceLessons.length} hasil</span></span></Accordion.Trigger><Accordion.Content class="pb-4"><div class="divide-y">{#each referenceLessons as lesson}<details class="py-3"><summary class="flex min-h-11 cursor-pointer items-center justify-between gap-4 text-sm font-medium"><span><Text text={lesson.title} scale="ui" /></span><Badge variant="outline">Bagian {moduleNumber(lesson.module)}</Badge></summary><div class="pb-3 pt-2"><p class="text-sm leading-7 text-muted-foreground"><Text text={lesson.intro} /></p><Button href={`#reference?lesson=${lesson.id}`} variant="link" class="h-11 px-0">Buka penjelasan</Button></div></details>{/each}</div></Accordion.Content></Accordion.Item></Accordion.Root></Tabs.Content><Tabs.Content value="source"><SourceReader selectedId={sourceSectionId} {search} lessonId={referenceLessonId} /></Tabs.Content></Tabs.Root>

    {:else if route === 'settings'}
      <PageHeader title="Pengaturan" description="Atur keterbacaan dan kelola cadangan progres pada perangkat ini." />
      <div class="grid gap-5 lg:grid-cols-2"><Card.Root class="shadow-none"><Card.Header><Card.Title class="text-base">Ukuran teks Arab</Card.Title><Card.Description>Contoh dan latihan menggunakan ukuran {progress.arabicSize} px.</Card.Description></Card.Header><Card.Content><input type="range" value={progress.arabicSize} oninput={setArabicSize} min="24" max="48" step="2" aria-label="Ukuran teks Arab" class="h-11 w-full cursor-pointer accent-primary" /><div class="mt-8 grid min-h-32 place-items-center rounded-xl bg-muted/60 px-4"><p class="font-arabic text-[length:var(--arabic-size)] leading-loose" lang="ar" dir="rtl">فَعَلَ يَفْعِلُ فَعْلًا</p></div><div class="mt-3 flex justify-between text-xs text-muted-foreground"><span>24 px</span><span>48 px</span></div></Card.Content></Card.Root><Card.Root class="shadow-none"><Card.Header><Card.Title class="text-base">Cadangan progres</Card.Title><Card.Description>Ekspor sebelum berpindah browser atau menghapus data situs.</Card.Description></Card.Header><Card.Content><div class="flex flex-col gap-3"><Button class="h-11" onclick={() => download(backup(progress), `sharaf-progres-${today()}.json`)}>Ekspor cadangan</Button>{#if archivedData}<Button variant="outline" class="h-11" onclick={downloadArchive}>Unduh data sebelum migrasi</Button>{/if}{#if protectStoredData}<Button variant="outline" class="h-11" onclick={downloadOld}>Unduh data lama</Button>{/if}<label class="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border bg-background px-4 text-sm font-medium hover:bg-muted focus-within:ring-3 focus-within:ring-ring/25">Pilih cadangan untuk dipulihkan<input type="file" class="sr-only" accept=".json,application/json" onchange={selectBackup} /></label></div>{#if importError}<Alert.Root variant="destructive" class="mt-4"><Alert.Title>Cadangan tidak dapat dibaca</Alert.Title><Alert.Description>{importError}</Alert.Description></Alert.Root>{/if}</Card.Content></Card.Root></div>
      <Card.Root class="mt-5 shadow-none"><Card.Header><Card.Title class="text-base">Batas versi ini</Card.Title></Card.Header><Card.Content><p class="max-w-[70ch] text-sm leading-7 text-muted-foreground">Tanpa akun, sinkronisasi perangkat, dan akses offline penuh. Website tidak menilai pelafalan. Nilai cek adalah indikator pemahaman; retensi diperiksa lewat pengulangan nyata.</p></Card.Content></Card.Root>
      {#if pendingBackup}<AlertDialog.Root open={true} onOpenChange={(open) => { if (!open) pendingBackup = null; }}><AlertDialog.Content><AlertDialog.Header><AlertDialog.Title>Ganti progres dengan cadangan ini?</AlertDialog.Title><AlertDialog.Description>{lessons.filter(lesson => isPassed(pendingBackup!, lesson)).length} pelajaran dikuasai dan {Object.keys(pendingBackup.cards).length} kartu akan dipulihkan. Progres saat ini disalin sebelum diganti.</AlertDialog.Description></AlertDialog.Header><AlertDialog.Footer><AlertDialog.Cancel class="h-11" onclick={() => pendingBackup = null}>Batalkan</AlertDialog.Cancel><AlertDialog.Action class="h-11" onclick={restoreBackup}>Ganti progres</AlertDialog.Action></AlertDialog.Footer></AlertDialog.Content></AlertDialog.Root>{/if}

    {:else}
      <Card.Root class="mx-auto max-w-xl border-dashed text-center shadow-none"><Card.Content class="py-14"><h1 class="text-xl font-semibold">Halaman tidak ditemukan</h1><Button href="#today" class="mt-5 h-11">Kembali ke Beranda</Button></Card.Content></Card.Root>
    {/if}
  </AppShell>
</div>
