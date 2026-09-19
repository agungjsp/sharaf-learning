import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { lessons, questions, allQuestions, validateContent, legacyCards, legacyRevisions } from '../src/content.ts';
import { freshProgress, grade, finishLesson, isPassed, stateFor, reviewCard, dueCards, activeCards, addDays, readBackup, backup, validateProgress, saveProgress, loadProgress, cardId, STORAGE_KEY, ARCHIVE_KEY } from '../src/engine.ts';
function lesson(id: string) { return lessons.find(l=>l.id===id)!; }
function pass(p=freshProgress(), l=lesson('harakat'), day='2026-09-15') { const q=questions(l,0); finishLesson(p,l,q,q.map(q=>q.answer),day); return p; }
function legacy() {
  return {formatVersion:1,contentVersion:1,arabicSize:32,lastLesson:'harakat',lessons:{harakat:{step:5,passed:true,attempts:1,score:5,revision:1,wrong:[]}},cards:{'harakat:0':{interval:4,due:'2026-09-19',successes:['2026-08-01','2026-08-04','2026-08-11'],lastReviewed:'2026-08-11',weak:false}}};
}
test('every lesson has stable IDs, separate practice and a five-question application check',()=>{
  validateContent();
  for(const l of lessons) for(let attempt=0;attempt<4;attempt++) {
    const exam=questions(l,attempt), practice=questions(l,attempt,'practice');
    assert.equal(exam.length,5);assert.ok(exam.filter(q=>q.kind!=='choice').length>=2);
    assert.ok(exam.some(q=>q.required));assert.ok(exam.every(q=>!practice.some(p=>p.id===q.id)));
    assert.ok(exam.every(q=>q.options.includes(q.answer)));
    assert.equal(new Set(l.facts.map(f=>f.id)).size,l.facts.length);
  }
});
test('choice order is seedable and is not the same answer position for a whole check',()=>{
  function seeded(){let n=12345;return ()=>((n=Math.imul(n,1664525)+1013904223>>>0)/4294967296);}
  const a=questions(lesson('harakat'),0,'check',seeded()),b=questions(lesson('harakat'),0,'check',seeded());
  assert.deepEqual(a,b);assert.ok(new Set(a.map(q=>q.options.indexOf(q.answer))).size>1);
});
test('four correct including both required applications; serverless engine uses canonical keys',()=>{
 const l=lesson('harakat'),q=questions(l,0),answers=q.map(q=>q.answer);
 assert.equal(grade(q,answers).passed,true);
 const optional=q.findIndex(q=>!q.required),required=q.findIndex(q=>q.required);
 const a=[...answers];a[optional]='wrong';assert.equal(grade(q,a).passed,true);
 a[required]='wrong';assert.equal(grade(q,a).passed,false);
 const p=freshProgress(),fake=q.map(q=>({...q,answer:'invented',required:false}));
 assert.equal(finishLesson(p,l,fake,Array(5).fill('invented')).passed,false);
 assert.throws(()=>finishLesson(p,l,questions(l,0,'practice'),[]));
});
test('free learning order, persistent historic pass and independent current mastery',()=>{
 const p=pass(freshProgress(),lesson('batas-materi'));
 assert.equal(isPassed(p,lesson('batas-materi')),true);assert.doesNotThrow(()=>validateProgress(p));
 const l=lesson('harakat'),q=questions(l,0);pass(p,l);
 finishLesson(p,l,q,[]);assert.equal(isPassed(p,l),true);
 assert.equal(Object.keys(p.cards).length,10);
});
test('failed revision recheck remains reloadable with old cards and later passed lessons',()=>{
 const p=pass(),l=lesson('harakat');pass(p,lesson('tanda-lanjutan'));
 p.lessons[l.id].revision=1;p.lessons[l.id].masteredRevision=1;
 for(const [id,c] of Object.entries(p.cards))if(id.startsWith('harakat:')){c.revision=1;c.interval=4;}
 assert.equal(stateFor(p,l).passed,true);assert.equal(isPassed(p,l),false);
 finishLesson(p,l,questions(l,0),[],'2026-09-19');
 const restored=readBackup(backup(p));assert.equal(restored.lessons[l.id].passed,true);
 assert.equal(isPassed(restored,l),false);assert.equal(activeCards(restored).some(([id])=>id.startsWith('harakat:')),false);
 const q=questions(l,1);finishLesson(restored,l,q,q.map(q=>q.answer),'2026-09-20');
 assert.equal(restored.cards[cardId(l,0)].interval,0);assert.equal(restored.cards[cardId(l,0)].due,'2026-09-21');
 assert.equal(isPassed(restored,lesson('tanda-lanjutan')),true);assert.doesNotThrow(()=>validateProgress(restored));
});
test('v1 cards migrate exactly and storage keeps the original bytes before any v2 save',()=>{
 const old=legacy(),raw=JSON.stringify(old),data=new Map([[STORAGE_KEY,raw]]);
 const storage={getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);}};
 const p=loadProgress(storage);assert.equal(data.get(ARCHIVE_KEY),raw);assert.equal(data.get(STORAGE_KEY),raw);
 assert.deepEqual(p.cards[legacyCards['harakat:0']],{...old.cards['harakat:0'],revision:1});
 assert.equal(p.lessons.harakat.masteredRevision,1);assert.equal(isPassed(p,lesson('harakat')),false);
 saveProgress(storage,p);assert.deepEqual(loadProgress(storage),p);assert.equal(data.get(ARCHIVE_KEY),raw);
 assert.throws(()=>loadProgress({getItem:(key:string)=>key === STORAGE_KEY ? raw : null,setItem(){throw Error('Quota');}}));
 assert.equal(Object.keys(legacyRevisions).length,24);assert.equal(Object.keys(legacyCards).length,120);
});
test('v1 failed-recheck bug is recoverable without granting current mastery',()=>{
 const old=legacy();old.lessons.harakat.revision=2;old.lessons.harakat.passed=false;
 const p=validateProgress(old);assert.equal(p.lessons.harakat.passed,true);assert.equal(p.lessons.harakat.masteredRevision,1);
 assert.equal(isPassed(p,lesson('harakat')),false);assert.doesNotThrow(()=>readBackup(backup(p)));
});
test('draft round trip keeps ordered options and answers; old revisions are discarded',()=>{
 const p=freshProgress(),l=lesson('harakat'),q=questions(l,0);
 p.drafts[l.id]={lesson:l.id,revision:l.revision,mode:'check',questions:q,answers:q.map((q,i)=>i===0?q.answer:''),index:0,checked:false};
 assert.deepEqual(readBackup(backup(p)),p);
 const wrong=structuredClone(p);wrong.drafts[l.id].questions[0].options=['not a real choice'];assert.throws(()=>validateProgress(wrong));
 p.drafts[l.id].revision=1;assert.deepEqual(validateProgress(p).drafts,{});
});
test('calendar intervals, lapse, overdue ordering and duplicate-day protection',()=>{
 assert.equal(addDays('2026-12-31',1),'2027-01-01');assert.equal(addDays('2028-02-28',1),'2028-02-29');
 const p=pass(),id=cardId(lesson('harakat'),0);assert.deepEqual(dueCards(p,'2026-09-15'),[]);
 assert.equal(reviewCard(p,id,true,'2026-09-16'),true);assert.equal(p.cards[id].due,'2026-09-19');
 assert.equal(reviewCard(p,id,true,'2026-09-16'),false);
 reviewCard(p,id,true,'2026-09-19');reviewCard(p,id,true,'2026-09-26');assert.equal(p.cards[id].successes.length,3);
 reviewCard(p,id,false,'2026-10-10');assert.equal(p.cards[id].due,'2026-10-11');assert.equal(p.cards[id].successes.length,0);
 assert.equal(isPassed(p,lesson('harakat')),true);
});
test('invalid backups and storage failure never silently replace progress',()=>{
 const p=pass();assert.deepEqual(readBackup(backup(p)),p);
 for(const raw of ['{','{}','x'.repeat(2_000_001)])assert.throws(()=>readBackup(raw));
 for(const bad of [{...p,formatVersion:3},{...p,arabicSize:100},{...p,cards:{bad:{}}},{...p,drafts:{unknown:{}}}])assert.throws(()=>validateProgress(bad));
 const bad=structuredClone(p);bad.cards[cardId(lesson('harakat'),0)].due='2026-02-31';assert.throws(()=>validateProgress(bad));
 const proto=JSON.parse(JSON.stringify(p));Object.defineProperty(proto.lessons,'__proto__',{value:{},enumerable:true});assert.throws(()=>validateProgress(proto));
 assert.throws(()=>saveProgress({setItem(){throw Error('Quota exceeded');}},p));
 assert.ok(allQuestions(lesson('harakat')).length>10);
});

test('a full backup produced by the original v1 engine preserves all 24 passes and 120 cards',()=>{
 const raw=readFileSync(new URL('./fixtures/v1-complete.json',import.meta.url),'utf8');
 const old=JSON.parse(raw).progress,p=readBackup(raw);
 assert.equal(Object.values(p.lessons).filter(s=>s.passed).length,24);assert.equal(Object.keys(p.cards).length,120);
 for(const [oldId,c] of Object.entries(old.cards))assert.deepEqual(p.cards[legacyCards[oldId]],{...c as object,revision:old.lessons[oldId.split(':')[0]].revision});
 assert.deepEqual(readBackup(backup(p)),p);
});
