import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { lessons, allQuestions, questions } from '../src/content.ts';
import { applications, coverage } from '../src/curriculum.ts';
import { sourceText, sourceSections, sourceTable } from '../src/source.ts';
test('bundled source equals the user source and every heading has a unique address and coverage entry',()=>{
 assert.equal(sourceText,readFileSync(new URL('../docs/sumber.md',import.meta.url),'utf8'));
 assert.equal(new Set(sourceSections.map(s=>s.id)).size,sourceSections.length);
 assert.equal(sourceSections.length,sourceText.split('\n').filter(l=>/^#{1,3} /.test(l)).length);
 assert.equal(coverage(lessons).length,sourceSections.length);
 for(const row of coverage(lessons)){assert.ok(row.reason);assert.ok(row.section.line>0);}
 for(const l of lessons)for(const id of l.sourceIds)assert.ok(sourceSections.some(s=>s.id===id),l.id);
});
test('all positions of principal source tables are taught without losing repeated written forms',()=>{
 const mappings=[['peta-dhamir','1.2 '],['madhi-lengkap','7.1 '],['mudhari-lengkap','7.2 '],['madhi-majhul-lengkap','7.10 '],['mudhari-majhul-lengkap','7.11 '],['amr-lengkap','7.6 '],['nahyi-lengkap','7.7 '],['mashdar-jumlah','7.3 '],['fail-jumlah','7.4 '],['maful-jumlah','7.5 '],['nashab-terpisah','1.3 '],['objek-lengkap','1.8 '],['pemilik-lengkap','1.9 ']];
 for(const [prefix,section] of mappings){const taught=lessons.filter(l=>l.id.startsWith(prefix+'-'));const facts=taught.flatMap(l=>l.facts);assert.equal(facts.length,sourceTable(section).rows.length,prefix);assert.deepEqual(facts.map(f=>f.term),sourceTable(section).rows.map(r=>r[1]),prefix);}
});
test('application cues have a single answer; repeated forms are never assessed without context',()=>{
 for(const l of lessons){const seen=new Map<string,string>();for(const a of applications[l.id]){assert.ok(!seen.has(a.cue)||seen.get(a.cue)===a.answer,l.id);seen.set(a.cue,a.answer);}
  for(const q of allQuestions(l).filter(q=>q.kind==='choice'&&q.purpose==='check')){const f=l.facts.find(f=>f.id===q.concept)!;assert.equal(l.facts.filter(x=>x.term===f.term).length,1,q.id);}
 }
 for(let bab=1;bab<=6;bab++)assert.ok(lessons.some(l=>l.id===`penerapan-bab-${bab}`));
});
test('remediation addresses the failed application and the next check uses a different variant',()=>{
 const l=lessons.find(l=>l.id==='harakat')!,exam=questions(l,0),wrong=exam.filter(q=>q.kind!=='choice').map(q=>q.id);
 const repair=questions(l,1,'practice',Math.random,wrong);
 assert.ok(repair[0].id.includes(':remediate:'));assert.equal(repair[0].answer,exam.find(q=>q.id===wrong[0])!.answer);
 const next=questions(l,1);assert.notDeepEqual(next.map(q=>q.id),exam.map(q=>q.id));
});

test('all seven jar sequences preserve the fourteen literal forms from the source',()=>{
 const sections=sourceSections.filter(s=>s.title.startsWith('1.10 ')||s.title.startsWith('Dengan '));
 assert.equal(sections.length,7);
 for(const section of sections){const table=section.blocks.find(b=>b.type==='table');assert.ok(table&&table.type==='table');assert.equal(table.rows.length,14);assert.equal(table.rows[0][1],'هُوَ');assert.equal(table.rows[13][1],'نَحْنُ');}
});
