import { lessons, allQuestions, legacyCards } from './content.ts';
import type { Progress, Lesson, Question, LessonState, Draft } from './types.ts';
export const STORAGE_KEY = 'sharaf.progress.v1';
export const ARCHIVE_KEY = 'sharaf.progress.before-v2';
export const intervals = [1, 3, 7, 14, 30];
export function today(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}
export function addDays(day: string, days: number) {
  const [y,m,d] = day.split('-').map(Number);
  return today(new Date(y,m-1,d+days,12));
}
export function freshProgress(): Progress {
  return { formatVersion: 2, contentVersion: 2, lessons: {}, cards: {}, drafts: {}, arabicSize: 32, lastLesson: null };
}
export function isPassed(p: Progress, l: Lesson) {
  return p.lessons[l.id]?.passed === true && p.lessons[l.id].masteredRevision === l.revision;
}
export function stateFor(p: Progress, l: Lesson): LessonState {
  const state = p.lessons[l.id];
  return state?.revision === l.revision ? state : {
    step: 0, passed: state?.passed ?? false, masteredRevision: state?.masteredRevision ?? 0,
    attempts: 0, score: 0, revision: l.revision, wrong: [],
  };
}
export function nextLesson(p: Progress) { return lessons.find(l => !isPassed(p,l)); }
export function cardId(l: Lesson, index: number) { return `${l.id}:${l.facts[index].id}`; }
export function getCard(id: string) {
  const split = id.lastIndexOf(':'), lesson = lessons.find(l => l.id === id.slice(0,split));
  const fact = lesson?.facts.find(f => f.id === id.slice(split+1));
  return lesson && fact ? { lesson, fact } : null;
}
export function activeCards(p: Progress) {
  return Object.entries(p.cards).filter(([id,c]) => {
    const card = getCard(id);
    return card && isPassed(p,card.lesson) && c.revision === card.lesson.revision;
  });
}
export function grade(qs: Question[], answers: string[]) {
  const correct = qs.map((q,i) => q.answer === answers[i]);
  const score = correct.filter(Boolean).length;
  return { score, passed: qs.length === 5 && score >= 4 && qs.some(q=>q.required) && qs.every((q,i) => !q.required || correct[i]), wrong: qs.filter((_,i) => !correct[i]).map(q=>q.id) };
}
export function finishLesson(p: Progress, l: Lesson, qs: Question[], answers: string[], day = today()) {
  const bank = allQuestions(l), canonical = qs.map(q => bank.find(item => item.id === q.id));
  if (qs.length !== 5 || new Set(qs.map(q=>q.id)).size !== 5 || canonical.some(q=>!q || q.purpose !== 'check') || canonical.filter(q=>q?.kind !== 'choice').length < 2) throw Error('Set soal tidak valid.');
  const result = grade(canonical as Question[],answers), old = stateFor(p,l);
  p.lessons[l.id] = { ...old, masteredRevision: result.passed ? l.revision : old.masteredRevision,
    passed: old.passed || result.passed, attempts: old.attempts+1, score: result.score, wrong: result.wrong, step: 5 };
  p.lastLesson = l.id; delete p.drafts[l.id];
  if (result.passed) for (let i=0;i<l.facts.length;i++) {
    const id = cardId(l,i);
    if (!p.cards[id] || p.cards[id].revision !== l.revision) p.cards[id] = { revision: l.revision, interval: 0, due: addDays(day,1), successes: [], lastReviewed: null, weak: false };
  }
  return result;
}
export function dueCards(p: Progress, day=today()) {
  return activeCards(p).filter(([,c])=>c.due <= day && c.lastReviewed !== day)
    .sort((a,b)=>a[1].due.localeCompare(b[1].due) || a[0].localeCompare(b[0])).map(([id])=>id);
}
export function reviewCard(p: Progress, id: string, remembered: boolean, day=today()) {
  const c = p.cards[id], card = getCard(id);
  if (!c || !card || !isPassed(p,card.lesson) || c.revision !== card.lesson.revision || c.due > day || c.lastReviewed === day) return false;
  c.interval = remembered ? Math.min(c.interval+1,4) : 0;
  c.due = addDays(day, intervals[c.interval]); c.lastReviewed = day; c.weak = !remembered;
  c.successes = remembered ? [...new Set([...c.successes,day])].slice(-3) : [];
  return true;
}
function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function integer(n: unknown, min: number, max: number): n is number { return typeof n === 'number' && Number.isInteger(n) && n >= min && n <= max; }
function date(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && addDays(value,0) === value;
}
function fail(): never { throw Error('Cadangan tidak valid atau versinya belum didukung. Data lama tetap disimpan.'); }
function validateDraft(value: unknown, lesson: Lesson): Draft | null {
  if (!record(value) || value.lesson !== lesson.id || !integer(value.revision,1,lesson.revision)) return fail();
  if (value.revision !== lesson.revision) return null;
  if ((value.mode !== 'practice' && value.mode !== 'check') || !Array.isArray(value.questions) || value.questions.length < 1 || value.questions.length > 20 || !Array.isArray(value.answers) || value.answers.length !== value.questions.length || !integer(value.index,0,value.questions.length-1) || typeof value.checked !== 'boolean') return fail();
  const bank = allQuestions(lesson);
  const qs = value.questions.map(q => {
    if (!record(q) || !Array.isArray(q.options) || q.options.some(o=>typeof o !== 'string')) return fail();
    const canonical = bank.find(item=>item.id === q.id && item.purpose === value.mode);
    if (!canonical || q.options.length !== canonical.options.length || new Set(q.options).size !== q.options.length || q.options.some(o=>!canonical.options.includes(o as string))) return fail();
    return { ...canonical, options: [...q.options] as string[] };
  });
  if (new Set(qs.map(q=>q.id)).size !== qs.length || value.answers.some((a,i)=>typeof a !== 'string' || (a !== '' && !qs[i].options.includes(a)))) return fail();
  if (value.mode === 'check' && (qs.length !== 5 || qs.filter(q=>q.kind !== 'choice').length < 2)) return fail();
  return { lesson:lesson.id, revision:lesson.revision, mode:value.mode, questions:qs, answers:[...value.answers] as string[], index:value.index, checked:value.checked };
}
export function validateProgress(input: unknown): Progress {
  if (!record(input) || ![1,2].includes(input.formatVersion as number) || input.contentVersion !== input.formatVersion || !record(input.lessons) || !record(input.cards) || !integer(input.arabicSize,24,48)) return fail();
  const legacy = input.formatVersion === 1;
  if (input.lastLesson !== null && !lessons.some(l=>l.id===input.lastLesson)) return fail();
  const out = freshProgress(); out.arabicSize=input.arabicSize; out.lastLesson=input.lastLesson as string|null;
  for (const [id,value] of Object.entries(input.lessons)) {
    const l = lessons.find(l=>l.id===id);
    if (!l || !record(value) || !integer(value.step,0,5) || typeof value.passed !== 'boolean' || !integer(value.attempts,0,1000000) || !integer(value.score,0,5) || !integer(value.revision,1,l.revision) || !Array.isArray(value.wrong)) return fail();
    const bank = allQuestions(l);
    if (value.wrong.length > bank.length || value.wrong.some(q=>typeof q !== 'string')) return fail();
    if (!legacy && value.wrong.some(q=>!bank.some(item=>item.id===q))) return fail();
    if (legacy && value.wrong.some(q=>!new RegExp(`^${id}:[ab]:[0-4]$`).test(q as string))) return fail();
    const masteredRevision = legacy ? (value.passed ? value.revision : 0) : value.masteredRevision;
    if (!integer(masteredRevision,0,value.revision) || (!legacy && value.passed !== (masteredRevision > 0))) return fail();
    out.lessons[id]={ step:value.step, passed:value.passed, masteredRevision, attempts:value.attempts, score:value.score, revision:value.revision, wrong:legacy ? [] : [...value.wrong] as string[] };
  }
  for (const [oldId,value] of Object.entries(input.cards)) {
    const id = legacy ? legacyCards[oldId] : oldId, data = id ? getCard(id) : null;
    if (!data || !record(value) || !integer(value.interval,0,4) || !date(value.due) || !Array.isArray(value.successes) || value.successes.length>3 || value.successes.some(d=>!date(d)) || new Set(value.successes).size!==value.successes.length || (value.lastReviewed!==null && !date(value.lastReviewed)) || typeof value.weak!=='boolean') return fail();
    const state = out.lessons[data.lesson.id]; if (!state) return fail();
    // Recover v1's failed-recheck state: existing cards prove an earlier pass, not current mastery.
    if (legacy && !state.passed) {
      if (state.revision < 2 || state.attempts < 1) return fail();
      state.passed = true; state.masteredRevision = state.revision - 1;
    }
    const revision = legacy ? state.masteredRevision : value.revision;
    if (!state.passed || !integer(revision,1,data.lesson.revision) || revision > state.masteredRevision) return fail();
    out.cards[id]={ revision, interval:value.interval, due:value.due, successes:[...value.successes] as string[], lastReviewed:value.lastReviewed as string|null, weak:value.weak };
  }
  if (!legacy) {
    if (!record(input.drafts)) return fail();
    for (const [id,value] of Object.entries(input.drafts)) {
      const l = lessons.find(l=>l.id===id); if (!l) return fail();
      const draft = validateDraft(value,l); if (draft) out.drafts[id]=draft;
    }
  }
  return out;
}
export function readBackup(raw: string) {
  if (new TextEncoder().encode(raw).length > 2_000_000) throw Error('Berkas terlalu besar. Pilih cadangan JSON Sharaf di bawah 2 MB.');
  let value: unknown;
  try { value = JSON.parse(raw); } catch { throw Error('Berkas bukan JSON yang dapat dibaca. Progres lama tidak diubah.'); }
  if (!record(value) || typeof value.exportedAt !== 'string' || !Number.isFinite(Date.parse(value.exportedAt)) || !('progress' in value)) throw Error('Ini bukan berkas cadangan Sharaf.');
  return validateProgress(value.progress);
}
export function backup(p: Progress) { return JSON.stringify({ exportedAt:new Date().toISOString(), progress:p },null,2); }
export function loadProgress(storage: Pick<Storage,'getItem'|'setItem'>) {
  const raw=storage.getItem(STORAGE_KEY);
  if (!raw) return freshProgress();
  const parsed: unknown = JSON.parse(raw), progress = validateProgress(parsed);
  if (record(parsed) && parsed.formatVersion === 1 && !storage.getItem(ARCHIVE_KEY)) storage.setItem(ARCHIVE_KEY,raw);
  return progress;
}
export function saveProgress(storage: Pick<Storage,'setItem'>, p: Progress) {
  storage.setItem(STORAGE_KEY,JSON.stringify(validateProgress(p)));
}
