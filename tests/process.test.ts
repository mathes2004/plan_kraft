import { describe, it, expect } from 'vitest';
import { stages, nextStep, previousStep } from '@/data/process';
describe('workflow progression', () => {
  it('has eight different stages', () => expect(new Set(stages.map((s) => s[0])).size).toBe(8));
  it('advances through the complete process without wrapping', () => {
    let step = 0;
    for (let i = 0; i < 10; i++) step = nextStep(step);
    expect(step).toBe(7);
  });
  it('never steps before inspection', () => expect(previousStep(0)).toBe(0));
});
