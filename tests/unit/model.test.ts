import { describe, expect, it } from 'vitest';
import { lessons } from '../../src/content';
import { advanceQuestion, answerQuestion, initialProgress, makeQuestion, parseProgress, recommendedLesson, ROUND_COUNT, skillStats, type Progress } from '../../src/model';

const practice = (id = 'eq-1'): Progress => ({ ...initialProgress(), session: { id: 'session-1', lessonId: id, seed: 4294967295, index: 0, started: true, answers: [] } });

describe('question generation', () => {
  it.each(lessons)('$id: deterministic, valid and varied over seeds', lesson => {
    const corrects = new Set<string>();
    for (let seed = 0; seed < 100; seed++) {
      const q = makeQuestion(lesson.id, seed, 0);
      expect(q).toEqual(makeQuestion(lesson.id, seed, 0));
      expect(q.options.filter(o => o.id === q.correct)).toHaveLength(1);
      expect(new Set(q.options.map(o => o.id)).size).toBe(q.options.length);
      corrects.add(q.correct);
      if (q.kind === 'memory') {
        expect(q.notesA.length).toBe(lesson.level + 2);
        const differences = q.notesA.filter((note, i) => q.notesB[i] !== note).length;
        expect(differences).toBe(q.correct === 'same' ? 0 : 1);
      }
      if (q.kind === 'direction') {
        const delta = q.notesA[1] - q.notesA[0];
        expect(q.correct).toBe(delta > 0 ? 'up' : delta < 0 ? 'down' : 'same');
      }
      if (q.kind === 'interval') expect(q.notesA[1] - q.notesA[0]).toBe(Number(q.correct));
      if (q.kind === 'chord') expect(q.notesA[1] - q.notesA[0]).toBe(q.correct === 'minor' ? 3 : 4);
      if (q.kind === 'eq') expect(q.frequency).toBe(Number(q.correct));
    }
    expect(corrects.size).toBeGreaterThan(1);
  });
});

describe('saved practice', () => {
  it('scores once, survives reload, and completes exactly five answers', () => {
    let p = practice();
    expect(advanceQuestion(p)).toBe(p);
    expect(answerQuestion(p, 'invalid')).toBe(p);
    for (let i = 0; i < ROUND_COUNT; i++) {
      const q = makeQuestion(p.session!.lessonId, p.session!.seed, i);
      p = answerQuestion(p, q.correct);
      const once = p;
      expect(answerQuestion(p, q.options[0].id)).toBe(once);
      p = parseProgress(JSON.stringify(p));
      expect(p.session?.answers[i].correct).toBe(true);
      p = advanceQuestion(p);
    }
    expect(p.session).toBeNull();
    expect(p.attempts).toHaveLength(5);
    expect(p.results).toHaveLength(1);
    expect(p.results[0]).toMatchObject({ correct: 5, total: 5 });
    expect(advanceQuestion(p)).toBe(p);
  });
  it('does not allow answering before lesson starts', () => {
    const p = practice(); p.session!.started = false;
    expect(answerQuestion(p, '120')).toBe(p);
  });
  it('keeps skill scores independent', () => {
    const p = practice('direction-1');
    const q = makeQuestion('direction-1', p.session!.seed, 0);
    const answered = answerQuestion(p, q.correct);
    expect(skillStats(answered, 'direction')).toEqual({ count: 1, accuracy: 100 });
    expect(skillStats(answered, 'eq')).toEqual({ count: 0, accuracy: null });
  });
  it('changes recommendations only after repeated practice and respects main path', () => {
    const p = initialProgress();
    expect(recommendedLesson(p).id).toBe('eq-1');
    p.attempts = Array.from({ length: 10 }, (_, index) => ({ lessonId: 'eq-1', index: index % 5, sessionId: String(index), at: new Date().toISOString(), correct: index < 8 }));
    expect(recommendedLesson(p).id).toBe('eq-2');
    p.path = 'exam';
    expect(recommendedLesson(p).id).toBe('memory-1');
  });
});

describe('storage validation', () => {
  it.each([null, '', '{', 'null', '[]', '{"version":99}', '{"version":1,"session":{}}'])('handles invalid records: %s', raw => {
    expect(parseProgress(raw).session).toBeNull();
  });
  it('drops unknown lessons, invalid statistics and impossible session positions', () => {
    const corrupt = { ...practice(), volume: 200, attempts: [{ lessonId: 'missing', correct: true }], results: [{ id: 'x', lessonId: 'eq-1', correct: -1, total: 5, at: 'bad' }] };
    corrupt.session!.index = 4;
    const p = parseProgress(JSON.stringify(corrupt));
    expect(p.volume).toBe(0.8);
    expect(p.session).toBeNull();
    expect(p.attempts).toEqual([]);
    expect(p.results).toEqual([]);
  });
  it('rejects tampered answers', () => {
    const p = practice();
    const q = makeQuestion('eq-1', p.session!.seed, 0);
    p.session!.answers = [{ choice: q.correct, correct: false, at: new Date().toISOString() }];
    expect(parseProgress(JSON.stringify(p)).session).toBeNull();
  });
});
