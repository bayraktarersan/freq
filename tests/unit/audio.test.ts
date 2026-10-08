import { describe, expect, it } from 'vitest';
import { makeLoop, makeNotes, matchLevelGroup, matchLevels, peak, rms } from '../../src/audio';
import { eqSourceIds } from '../../src/content';

describe('audio material', () => {
  it('makes deterministic, non-silent, finite source material', () => {
    const a = makeLoop(16000, 75), b = makeLoop(16000, 75);
    expect(a).toEqual(b);
    expect(a.length).toBe(64000);
    expect(rms(a)).toBeGreaterThan(0.03);
    expect(peak(a)).toBeLessThan(1);
    expect(a.every(Number.isFinite)).toBe(true);
    expect(Math.abs(a[0])).toBe(0);
  });
  it('matches RMS while keeping shared headroom below clipping', () => {
    const a = new Float32Array([0.2, -0.6, 0.4]);
    const b = new Float32Array([0.9, -3, 0.3]);
    const result = matchLevels(a, b);
    expect(Math.abs(result.dryRms - result.wetRms)).toBeLessThan(1e-6);
    expect(result.maxPeak).toBeLessThanOrEqual(0.720001);
  });
  it('handles silence without NaN or division by zero', () => {
    const result = matchLevels(new Float32Array(20), new Float32Array(20));
    expect(result.dryRms).toBe(0);
    expect(result.wetRms).toBe(0);
    expect(result.maxPeak).toBe(0);
  });
  it('renders different pitches and complete chords without clipping', () => {
    const a = makeNotes(16000, [60, 64]);
    const b = makeNotes(16000, [60, 67]);
    expect(a.length).toBe(b.length);
    expect(a).not.toEqual(b);
    expect(peak(makeNotes(16000, [60, 64, 67], true))).toBeLessThan(1);
  });
  it.each(eqSourceIds)('%s source is deterministic, audible and unclipped', source => {
    const a = makeLoop(16000, 75, source);
    expect(a).toEqual(makeLoop(16000, 75, source));
    expect(rms(a)).toBeGreaterThan(0.03);
    expect(peak(a)).toBeLessThan(1);
    expect(a.every(Number.isFinite)).toBe(true);
  });
  it('source choices actually produce different material', () => {
    const buffers = eqSourceIds.map(source => makeLoop(16000, 75, source));
    for (let i = 0; i < buffers.length; i++) for (let j = i + 1; j < buffers.length; j++) expect(buffers[i]).not.toEqual(buffers[j]);
  });
  it('matches all three comparison buffers using shared headroom', () => {
    const buffers = [new Float32Array([0.2, -0.6, 0.4]), new Float32Array([0.9, -3, 0.3]), new Float32Array([-0.4, 1, 0.8])];
    matchLevelGroup(buffers);
    for (const buffer of buffers) {
      expect(rms(buffer)).toBeCloseTo(rms(buffers[0]), 6);
      expect(peak(buffer)).toBeLessThanOrEqual(0.720001);
    }
  });
});
