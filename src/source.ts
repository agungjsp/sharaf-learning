import { sourceText } from "./source-text.ts";
export { sourceText };
export type SourceBlock = { type: "text"; text: string } | { type: "table"; headers: string[]; rows: string[][] };
export type SourceSection = { id: string; title: string; level: number; line: number; path: string[]; blocks: SourceBlock[] };
export function sourceTitle(title: string) {
  const numbered = /^(\d+(?:\.\d+)*)(?:\.)?\s+(.+)$/u.exec(title);
  const number = numbered?.[1] ?? '';
  const name = numbered?.[2] ?? title;
  const [first, ...rest] = name.split(/\s+[—–]\s+/u);
  if (rest.length && /\p{Script=Arabic}/u.test(first) && !/\p{Script=Latin}/u.test(first)) {
    return { number, label: rest.join(' — '), arabic: first };
  }
  return { number, label: name, arabic: '' };
}
export function plain(text: string) {
  return text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\*\*|`/g, "").replace(/^>\s?/gm, "").trim();
}
export function stableId(value: string) {
  let hash = 2166136261;
  for (const char of value.normalize("NFC")) hash = Math.imul(hash ^ char.codePointAt(0)!, 16777619);
  return (hash >>> 0).toString(36);
}
export function parseSource(text: string): SourceSection[] {
  const sections: SourceSection[] = [];
  let current: SourceSection | undefined;
  const parents: string[] = [];
  const counts = new Map<string, number>();
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim(), heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      const title = plain(heading[2]), level = heading[1].length;
      parents.length = level - 1; parents[level - 1] = title;
      const base = `s-${stableId(title)}`, occurrence = (counts.get(base) ?? 0) + 1;
      counts.set(base, occurrence);
      current = { id: occurrence === 1 ? base : `${base}-${occurrence}`, title, level, line: i + 1, path: parents.filter(Boolean), blocks: [] };
      sections.push(current); continue;
    }
    if (!current || !line || /^---+$/.test(line)) continue;
    if (line.startsWith("|") && /^\|[\s:|-]+\|$/.test(lines[i + 1]?.trim() ?? "")) {
      const cells = (row: string) => row.trim().replace(/^\||\|$/g, "").split("|").map(plain);
      const headers = cells(line), rows: string[][] = []; i += 2;
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(cells(lines[i++]));
      i--; current.blocks.push({ type: "table", headers, rows });
    } else {
      let paragraph = line;
      while (i + 1 < lines.length && lines[i + 1].trim() && !/^(#|\||---)/.test(lines[i + 1].trim())) paragraph += "\n" + lines[++i].trim();
      current.blocks.push({ type: "text", text: plain(paragraph) });
    }
  }
  return sections;
}
export const sourceSections = parseSource(sourceText);
const pronounSection = sourceSections.find(s=>s.title.startsWith('1.2 '));
const pronounTable = pronounSection?.blocks.find(b=>b.type==='table');
if (pronounTable?.type === 'table') {
  for (const section of sourceSections) {
    if (section.blocks.some(b=>b.type==='table')) continue;
    section.blocks = section.blocks.map(block => {
      if (block.type !== 'text') return block;
      const forms = block.text.split(/[،—]/u).map(s=>s.trim());
      if (forms.length !== 14 || forms.some(form=>!form || /[a-zA-Z]/.test(form))) return block;
      return { type:'table' as const, headers:['Posisi (§1.2)','Dhamir','Konteks','Bentuk dalam urutan sumber'],
        rows:forms.map((form,i)=>[String(i+1),pronounTable.rows[i][1],pronounTable.rows[i][3],form]) };
    });
  }
}
export function sectionByPrefix(prefix: string) {
  const section = sourceSections.find(section => section.title.startsWith(prefix));
  if (!section) throw Error(`Bagian sumber tidak ditemukan: ${prefix}`);
  return section;
}
export function sourceTable(prefix: string) {
  const section = sectionByPrefix(prefix), table = section.blocks.find(block => block.type === "table");
  if (!table || table.type !== "table") throw Error(`Tabel sumber tidak ditemukan: ${prefix}`);
  return { section, ...table };
}
export function normalizeSearch(value: string) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").toLowerCase().trim();
}
