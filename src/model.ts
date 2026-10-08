import { getLesson, lessons, text, type Locale, type PathId, type SkillId, type Text } from './content';

export const ROUND_COUNT = 5;
export type Option = { id: string; label: Text; detail?: Text };
export type Question = {
  kind: SkillId; options: Option[]; correct: string; notesA: number[]; notesB: number[];
  frequency?: number; gain?: number; q?: number; seed: number; explanation: Text;
};
export type Answer = { choice: string; correct: boolean; at: string };
export type Session = { id: string; lessonId: string; seed: number; index: number; started: boolean; answers: Answer[] };
export type Result = { id: string; lessonId: string; correct: number; total: number; at: string };
export type Attempt = { sessionId: string; index: number; correct: boolean; at: string; lessonId: string };
export type Progress = {
  version: 1; locale: Locale; path: PathId; volume: number; session: Session | null;
  attempts: Attempt[]; results: Result[];
};
export const STORAGE_KEY = 'freq.progress.v1';
export const initialProgress = (): Progress => ({ version: 1, locale: 'tr', path: 'mix', volume: 0.35, session: null, attempts: [], results: [] });
export function random(seed: number) {
  let a = seed >>> 0;
  return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
export function makeQuestion(lessonId: string, seed: number, index: number): Question {
  const lesson = getLesson(lessonId);
  const questionSeed = (seed + index * 2654435761) >>> 0;
  const rng = random(questionSeed);
  const pick = <T,>(values: T[]): T => values[Math.floor(rng() * values.length)];
  const base = 52 + Math.floor(rng() * 13);
  const common = { kind: lesson.skill, notesA: [] as number[], notesB: [] as number[], seed: questionSeed };
  if (lesson.skill === 'eq') {
    const frequencies = lesson.level === 1 ? [120, 1000, 6000] : lesson.level === 2 ? [100, 300, 1000, 3000, 7000] : [100, 250, 700, 1500, 3500, 7000];
    const labels = [text('Bas', 'Lows'), text('Orta', 'Mids'), text('Tiz', 'Highs')];
    const details = [text('Ağırlık ve derinlik', 'Weight & depth'), text('Gövde ve belirginlik', 'Body & presence'), text('Parlaklık ve hava', 'Brightness & air')];
    const frequency = pick(frequencies);
    const gain = lesson.level === 3 ? pick([-6, 6]) : 9;
    const q = lesson.level === 1 ? 0.65 : lesson.level === 2 ? 1 : 3;
    return { ...common, frequency, gain, q, correct: String(frequency),
      options: frequencies.map((hz, i) => ({ id: String(hz), label: lesson.level === 1 ? labels[i] : text(formatHz(hz), formatHz(hz)), detail: lesson.level === 1 ? details[i] : undefined })),
      explanation: text(`${formatHz(frequency)} çevresine ${gain > 0 ? 'yükseltme' : 'kesme'} uygulandı (${gain > 0 ? '+' : ''}${gain} dB, Q ${q}). A/B ile rengin nasıl değiştiğini tekrar dinle.`, `A ${gain > 0 ? 'boost' : 'cut'} was applied around ${formatHz(frequency)} (${gain > 0 ? '+' : ''}${gain} dB, Q ${q}). Compare A/B again to hear the change in tone.`) };
  }
  if (lesson.skill === 'direction') {
    const delta = pick([-7, -4, 0, 4, 7]);
    const correct = delta > 0 ? 'up' : delta < 0 ? 'down' : 'same';
    return { ...common, notesA: [base, base + delta], correct,
      options: [{ id: 'up', label: text('Yükseldi', 'Rose') }, { id: 'down', label: text('Alçaldı', 'Fell') }, { id: 'same', label: text('Aynı kaldı', 'Stayed the same') }],
      explanation: text(delta === 0 ? 'İki nota aynı yükseklikte. Tekrar dinlerken hareket olmadığını duy.' : `İkinci nota ${Math.abs(delta)} yarım ses ${delta > 0 ? 'yukarıda' : 'aşağıda'}. Tekrar dinlerken ikinci notanın yönüne odaklan.`, delta === 0 ? 'The notes have the same pitch. Listen again for the lack of movement.' : `The second note is ${Math.abs(delta)} semitones ${delta > 0 ? 'higher' : 'lower'}. Listen again and focus on its direction.`) };
  }
  if (lesson.skill === 'interval') {
    const intervals = [2, 4, 5, 7, 12];
    const labels = [text('Büyük ikili', 'Major second'), text('Büyük üçlü', 'Major third'), text('Tam dörtlü', 'Perfect fourth'), text('Tam beşli', 'Perfect fifth'), text('Oktav', 'Octave')];
    const interval = pick(intervals);
    return { ...common, notesA: [base, base + interval], correct: String(interval),
      options: intervals.map((v, i) => ({ id: String(v), label: labels[i], detail: text(`${v} yarım ses`, `${v} semitones`) })),
      explanation: text(`İki nota arasında ${interval} yarım ses var. İlk notayı hatırla ve ikinciye olan uzaklığı tekrar dinle.`, `The two notes are ${interval} semitones apart. Keep the first note in mind and listen to the distance again.`) };
  }
  if (lesson.skill === 'chord') {
    const minor = rng() < 0.5;
    return { ...common, notesA: [base, base + (minor ? 3 : 4), base + 7], correct: minor ? 'minor' : 'major',
      options: [{ id: 'major', label: text('Majör', 'Major') }, { id: 'minor', label: text('Minör', 'Minor') }],
      explanation: text(`Kök, ${minor ? 'küçük' : 'büyük'} üçlü ve tam beşli birlikte çalıyor. Üçlü, kökün ${minor ? 3 : 4} yarım ses üzerinde.`, `The root, ${minor ? 'minor' : 'major'} third and perfect fifth are played together. The third is ${minor ? 3 : 4} semitones above the root.`) };
  }
  const scale = [0, 2, 4, 5, 7, 9, 11];
  const degrees = Array.from({ length: lesson.level + 2 }, (_, i) => i === 0 ? 0 : Math.floor(rng() * 6));
  const notesA = degrees.map(d => base + scale[d]);
  const notesB = [...notesA];
  const same = rng() < 0.5;
  const changeAt = 1 + Math.floor(rng() * (notesA.length - 1));
  if (!same) notesB[changeAt] = base + scale[(degrees[changeAt] + 1) % scale.length];
  return { ...common, notesA, notesB, correct: same ? 'same' : 'different',
    options: [{ id: 'same', label: text('Aynı melodi', 'Same melody') }, { id: 'different', label: text('Bir nota farklı', 'One note changed') }],
    explanation: text(same ? 'İki melodinin bütün notaları aynı. A ve B’yi bir daha dinleyerek doğrula.' : `B melodisinde ${changeAt + 1}. nota değişti. A ve B’de o noktayı karşılaştır.`, same ? 'Every note in the two melodies is the same. Listen to A and B again to confirm.' : `Note ${changeAt + 1} changed in melody B. Compare that moment in A and B.`) };
}
export const formatHz = (hz: number) => hz >= 1000 ? `${hz / 1000} kHz` : `${hz} Hz`;
export const newSession = (lessonId: string): Session => ({ id: crypto.randomUUID(), lessonId, seed: crypto.getRandomValues(new Uint32Array(1))[0], index: 0, started: false, answers: [] });

export function answerQuestion(progress: Progress, choice: string, at = new Date().toISOString()): Progress {
  const s = progress.session;
  if (!s || !s.started || s.answers[s.index]) return progress;
  const question = makeQuestion(s.lessonId, s.seed, s.index);
  if (!question.options.some(o => o.id === choice)) return progress;
  const correct = question.correct === choice;
  return { ...progress, session: { ...s, answers: [...s.answers, { choice, correct, at }] },
    attempts: [...progress.attempts, { sessionId: s.id, index: s.index, lessonId: s.lessonId, correct, at }].slice(-2000) };
}
export function advanceQuestion(progress: Progress, at = new Date().toISOString()): Progress {
  const s = progress.session;
  if (!s || !s.answers[s.index]) return progress;
  if (s.index < ROUND_COUNT - 1) return { ...progress, session: { ...s, index: s.index + 1 } };
  const result: Result = { id: s.id, lessonId: s.lessonId, correct: s.answers.filter(a => a.correct).length, total: ROUND_COUNT, at };
  return { ...progress, session: null, results: [...progress.results, result].slice(-200) };
}
export function recommendedLesson(progress: Progress) {
  const pathLessons = lessons.filter(l => l.path === progress.path);
  return pathLessons.find(l => {
    const attempts = progress.attempts.filter(a => a.lessonId === l.id).slice(-10);
    return attempts.length < 10 || attempts.filter(a => a.correct).length < 8;
  }) ?? pathLessons[pathLessons.length - 1];
}
export function skillStats(progress: Progress, skill: SkillId) {
  const attempts = progress.attempts.filter(a => getLesson(a.lessonId).skill === skill).slice(-20);
  return { count: attempts.length, accuracy: attempts.length ? Math.round(attempts.filter(a => a.correct).length / attempts.length * 100) : null };
}

// Treat local storage as untrusted data. Older or malformed records never crash practice.
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const knownLesson = (v: unknown): v is string => typeof v === 'string' && lessons.some(l => l.id === v);
const validDate = (v: unknown): v is string => typeof v === 'string' && Number.isFinite(Date.parse(v));
export function parseProgress(raw: string | null): Progress {
  const fallback = initialProgress();
  if (!raw) return fallback;
  try {
    const v: unknown = JSON.parse(raw);
    if (!object(v) || v.version !== 1) return fallback;
    const p: Progress = { ...fallback, locale: v.locale === 'en' ? 'en' : 'tr',
      path: v.path === 'music' || v.path === 'exam' ? v.path : 'mix',
      volume: typeof v.volume === 'number' && Number.isFinite(v.volume) ? Math.min(0.8, Math.max(0.05, v.volume)) : fallback.volume };
    if (Array.isArray(v.attempts)) p.attempts = v.attempts.filter((a): a is Attempt => object(a) && knownLesson(a.lessonId) && typeof a.sessionId === 'string' && Number.isInteger(a.index) && (a.index as number) >= 0 && (a.index as number) < ROUND_COUNT && typeof a.correct === 'boolean' && validDate(a.at)).slice(-2000);
    if (Array.isArray(v.results)) p.results = v.results.filter((r): r is Result => object(r) && typeof r.id === 'string' && knownLesson(r.lessonId) && Number.isInteger(r.correct) && (r.correct as number) >= 0 && (r.correct as number) <= ROUND_COUNT && r.total === ROUND_COUNT && validDate(r.at)).slice(-200);
    const s = v.session;
    if (object(s) && typeof s.id === 'string' && knownLesson(s.lessonId) && Number.isInteger(s.seed) && (s.seed as number) >= 0 && (s.seed as number) <= 0xffffffff && Number.isInteger(s.index) && (s.index as number) >= 0 && (s.index as number) < ROUND_COUNT && typeof s.started === 'boolean' && Array.isArray(s.answers) && (s.answers.length === s.index || s.answers.length === (s.index as number) + 1)) {
      const valid = s.answers.every((a, i) => {
        const q = makeQuestion(s.lessonId as string, s.seed as number, i);
        return object(a) && typeof a.choice === 'string' && q.options.some(o => o.id === a.choice) && a.correct === (a.choice === q.correct) && validDate(a.at);
      });
      if (valid && (s.started || s.answers.length === 0 && s.index === 0)) p.session = s as Session;
    }
    return p;
  } catch { return fallback; }
}
