export type Fact = {
  id: string; term: string; meaning: string; why: string;
};
export type Lesson = {
  id: string; revision: number; module: number; title: string; goal: string;
  intro: string; analogy: string; contrast: string; summary: string[];
  source: string; sourceIds: string[]; verification: string; facts: Fact[]; prerequisite: string | null;
};
export type Question = {
  id: string; lesson: string; concept: string; prompt: string; options: string[]; answer: string;
  why: string; required: boolean; kind: "choice" | "match" | "table"; purpose: "practice" | "check";
  context?: { headers: string[]; cells: string[] };
};
export type LessonState = {
  step: number; passed: boolean; masteredRevision: number; attempts: number;
  score: number; revision: number; wrong: string[];
};
export type CardState = {
  revision: number; interval: number; due: string; successes: string[]; lastReviewed: string | null; weak: boolean;
};
export type Draft = {
  lesson: string; revision: number; mode: "practice" | "check";
  questions: Question[]; answers: string[]; index: number; checked: boolean;
};
export type Progress = {
  formatVersion: 2; contentVersion: 2;
  lessons: Record<string, LessonState>; cards: Record<string, CardState>; drafts: Record<string, Draft>;
  arabicSize: number; lastLesson: string | null;
};
